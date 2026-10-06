# Architecture & Engineering Decision Records (ADRs)

This document records the architectural, design, and algorithmic decisions made during the development of the Duolingo Web App Clone.

---

## 1. Backend Architecture: FastAPI + SQLAlchemy 2.x + SQLite (WAL Mode)

- **Context:** We needed a performant, relational, and self-contained backend that could strictly enforce data integrity, cascade deletions, check constraints, and transactional consistency.
- **Decision:** Use Python 3.13 with FastAPI and SQLAlchemy 2.0 ORM backed by SQLite in Write-Ahead Logging (`WAL`) mode with `PRAGMA foreign_keys = ON`.
- **Rationale:**
  - Zero external database setup requirement for judges and evaluators; runs immediately anywhere.
  - SQLite WAL mode permits concurrent reads while writes take place.
  - SQLAlchemy 2.0 provides type-safe query formulation and transaction isolation (`db.commit()` and `db.rollback()`).

---

## 2. Server-Authoritative Answer Checking

- **Context:** In educational gamification, client-side answer checking enables trivial inspection of correct answers via DevTools network or React state.
- **Decision:** The frontend receives sanitized exercise schemas containing *only* IDs, prompt texts, and option choices with `is_correct` stripped away.
- **Rationale:**
  - Guarantees anti-cheat integrity.
  - All normalization, accent tolerance ("almost correct" threshold), and typo tolerance (Levenshtein distance calculation) execute deterministically on the server.
  - Wrong answers trigger server-side heart decrements and append the exercise ID back to the active attempt queue.

---

## 3. Pure Dynamic Programming Levenshtein Implementation

- **Context:** Spec calls for typo tolerance (Levenshtein distance <= 1 for words >= 5 characters). Standard C-extensions (`python-Levenshtein`) frequently fail compilation on varied Windows environments and newer Python 3.13 runtimes.
- **Decision:** Implemented an optimized, zero-dependency 2-row dynamic programming Levenshtein distance algorithm directly in `app/services/answer_checker.py`.
- **Rationale:**
  - 100% portable across Windows, macOS, and Linux without MSVC or gcc dependencies.
  - Fully transparent, readable, and explainable in system design interviews and code reviews.

---

## 4. Lazy Hearts Regeneration (Zero-Cron Architecture)

- **Context:** Duolingo restores 1 heart every 4 hours (configurable, 300s in development). Running background cron jobs or celery workers per user introduces background process overhead, race conditions, and deployment complexity.
- **Decision:** Compute heart replenishment *lazily* upon every user read or mutation in `hearts_service.py`:
  $$\Delta t = \text{now} - \text{hearts\_updated\_at}$$
  $$\text{regened} = \lfloor \Delta t / \text{regen\_interval} \rfloor$$
- **Rationale:**
  - Zero background daemon required.
  - Works seamlessly with the time-travel simulated clock.
  - Constant time $O(1)$ computation.

---

## 5. Simulated Clock & Streak Time-Travel

- **Context:** Testing streak advancement, consecutive day preservation, streak freeze consumption, and missed-day streak resets takes days in real time.
- **Decision:** Implemented `app/core/clock.py` which computes virtual time using the user's localized timezone and their `settings.debug_day_offset`.
- **Rationale:**
  - Allows unit tests, automated integration tests, and manual QA to travel forward/backward in time instantly.
  - Does not mutate OS system clock or affect other system processes.

---

## 6. Mistake Re-queuing Mechanism

- **Context:** Spec requires that lessons only complete when the user has answered all exercises correctly.
- **Decision:** When an answer is incorrect, the server decrements a heart and pushes the failed exercise ID to the tail of the attempt's queue (`attempt.queue_json`).
- **Rationale:**
  - Forces the student to retry difficult questions until mastered before passing the lesson.
  - Accurately tracks total exercise attempts vs. unique exercises for completion accuracy scoring.

---

## 7. Dynamic Bot League Simulation

- **Context:** A leaderboard with 30 human players is difficult to simulate in isolated local development.
- **Decision:** Seeded 29 competitive bot personas with tier-appropriate baseline XP and an hourly progression velocity in `league_service.py`.
- **Rationale:**
  - User experiences real competition: bots gain XP as the week progresses.
  - Weekly rollover runs deterministically upon the first request after Sunday midnight UTC, executing promotions (top 10) and demotions (bottom 5).

---

## 8. Web Audio API Synthesis & Native SpeechSynthesis TTS

- **Context:** Copyrighted audio files cannot be bundled or scraped.
- **Decision:** Built a pure Web Audio API synthesizer (`lib/sfx.ts`) using standard oscillators and gain envelopes for snappy sound effects (tap, chime, buzz, fanfare). Pronunciation uses the browser's native `window.speechSynthesis` API with Spanish voice fallback.
- **Rationale:**
  - Zero external media assets required.
  - 0ms network latency on sound playback.
  - 100% compliant with copyright and licensing constraints.
