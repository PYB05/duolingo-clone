# System Architecture Notes & Engineering Walkthroughs

This document contains deep-dive technical explanations for system architecture, interview walkthroughs, and key algorithmic implementations across the Duolingo Web App Clone.

---

## 1. The Lesson CHECK Flow

### Lifecycle of an Answer Submission:
```
User selects/types answer 
  │
  ▼
Client sends POST /api/v1/attempts/{id}/answer
  │  Payload: { exercise_id: 14, answer: "la mujer", time_ms: 3200 }
  ▼
FastAPI reads User from X-User-Id header (default "learner")
  │
  ▼
answer_checker.py Normalization & Evaluation:
  1. Lowercase + trim whitespace
  2. Normalize Spanish accents: á->a, é->e, í->i, ó->o, ú->u, ñ->n
  3. Punctuation stripping: remove ¿ ? ¡ ! . , ; :
  4. Compare with accepted answers list:
     - Exact match -> is_correct = True, is_typo = False
     - Accent-stripped match -> is_correct = True, note = "Pay attention to accents!"
     - Levenshtein distance <= 1 (if word length >= 5) -> is_correct = True, is_typo = True
  │
  ▼
State Mutation & Heart Accounting:
  If Correct:
    - Attempt correct_count += 1
    - Attempt queue pop front
  If Incorrect:
    - Attempt mistake_count += 1
    - Heart decrement: hearts_service.change_hearts(user, -1)
    - Mistake Re-queue: append exercise_id to tail of attempt.queue_json
    - Record ExerciseMistake event in database
  │
  ▼
Transactional Commit:
  - Commit answer log, heart update, and attempt state atomically
  - Return SubmitAnswerResponse with sanitized solution note
```

---

## 2. Lazy Hearts Regeneration

### The Formula:
Rather than running an active background worker or cron daemon that queries millions of users every 4 hours, heart regeneration is calculated **lazily on read or mutation**:

$$\text{now} = \text{clock.now}(\text{user})$$
$$\Delta t = \max(0, (\text{now} - \text{user.hearts\_updated\_at}).\text{total\_seconds}())$$
$$\text{regened} = \min(5 - \text{user.hearts}, \lfloor \Delta t / \text{interval\_seconds} \rfloor)$$
$$\text{new\_hearts} = \text{user.hearts} + \text{regened}$$

If $\text{new\_hearts} < 5$:
$$\text{user.hearts\_updated\_at} = \text{user.hearts\_updated\_at} + (\text{regened} \times \text{interval\_seconds})$$
$$\text{next\_heart\_in\_seconds} = \text{interval\_seconds} - (\Delta t \pmod{\text{interval\_seconds}})$$
If $\text{new\_hearts} = 5$:
$$\text{next\_heart\_in\_seconds} = \text{null}$$

### Why this is resilient:
- Zero background compute cost when users are offline.
- Handles arbitrary simulated clock jumps forwards or backwards without database corruption.
- Instant, deterministic result in $O(1)$ time.

---

## 3. Streak Engine & Simulated Clock

### Time-Travel Simulation:
The user settings contain a `debug_day_offset: int`.
All date calculations flow through `app/core/clock.py`:
```python
def today(user: User) -> date:
    tz = ZoneInfo(user.timezone or "UTC")
    real_now = datetime.now(tz)
    simulated = real_now + timedelta(days=user.settings.debug_day_offset)
    return simulated.date()
```

### Streak Transition Rules:
When a user completes an activity on day $T$:
1. **Same Day ($T == \text{last\_active\_date}$):**
   - Streak unchanged. Activity logged.
2. **Consecutive Day ($T == \text{last\_active\_date} + 1\text{ day}$):**
   - Streak increments by 1.
   - Longest streak updated if `current_streak > longest_streak`.
   - Milestone events triggered (3, 7, 14, 30, 50, 100, 365 days).
3. **Missed One Day ($T == \text{last\_active\_date} + 2\text{ days}$):**
   - If user has `streak_freezes > 0`:
     - Freeze consumed (`streak_freezes -= 1`).
     - Day preserved as frozen. Streak increments to $\text{streak} + 1$.
   - If user has `streak_freezes == 0`:
     - Streak resets to 1.
4. **Missed Multiple Days ($T > \text{last\_active\_date} + 2\text{ days}$):**
   - Streak resets to 1 regardless of freeze balance.

### Displayed Streak Rule:
If the user opens the app on day $T$, has NOT studied yet today, and yesterday ($T - 1$) was missed without a streak freeze:
- `displayed_streak = 0` (shows that the streak is broken until they practice or repair).

---

## 4. Path & Skill Unlocking Topology

The curriculum is structured hierarchically:
$$\text{Course} \rightarrow \text{Sections} \rightarrow \text{Units} \rightarrow \text{Skills}$$

### State Resolution Rules:
Each skill resolves into one of 5 visual states:
1. `locked`: Prior required skill has not reached level 1.
2. `available`: Prior skill completed; current skill has 0 lessons finished.
3. `in_progress`: $0 < \text{lessons\_completed} < \text{total\_levels}$.
4. `completed`: $\text{lessons\_completed} == \text{total\_levels}$.
5. `legendary`: Skill completed AND Legendary challenge passed.

The special property `is_current` marks the exact single node on the path where the user should resume their learning.

---

## 5. Live League Leaderboard Simulation

Each league tier contains 30 competitors (1 human user + 29 bots).

### Dynamic Bot XP Progression:
To make leaderboards feel alive without real-time websockets or AI overhead:
$$\text{hour\_of\_week} = (\text{weekday} \times 24) + \text{hour}$$
$$\text{bot\_weekly\_xp} = \text{base\_xp} + \lfloor \text{velocity\_per\_hour} \times \text{hour\_of\_week} \times \text{variance\_factor} \rfloor$$

As the week progresses towards Sunday midnight, bots accumulate XP dynamically.
When Sunday midnight passes, the next API request triggers `evaluate_weekly_rollover`:
- Ranks 1–10: Promoted to next league tier (awarding gem bonuses).
- Ranks 11–25: Remain in current league tier.
- Ranks 26–30: Demoted to previous league tier (except Bronze tier).

---

## 6. Schema Trade-offs & Relational Integrity

### SQLite in WAL Mode:
- With SQLite Write-Ahead Logging (`WAL`), readers do not block writers, and writers do not block readers.
- `PRAGMA foreign_keys = ON` ensures foreign key constraints are enforced at the engine level with cascading deletes.

### Denormalization with Ledger:
- `user.total_xp` and `user.gems` are stored directly on the user row for high-performance reading on every page request.
- Every mutation appends an immutable event to `xp_events` or `gem_ledger`.
- Ledger reconciliations can run idempotently if discrepancies ever occur.
