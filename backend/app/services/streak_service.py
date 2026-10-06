"""
Streak rules (Section 7.6). The pure functions take dates so tests can
simulate any sequence of days without touching the clock.
"""

from dataclasses import dataclass
from datetime import date, timedelta
from typing import Optional

STREAK_MILESTONES = {3, 7, 14, 30, 50, 100, 150, 200, 365}


@dataclass
class StreakUpdate:
    before: int
    after: int
    longest: int
    extended: bool  # True when today's activity changed the streak (show streak screen)
    milestone: bool
    freeze_used_on: Optional[date] = None  # the missed day a freeze covered


def compute_streak_update(
    current: int,
    longest: int,
    last_activity: Optional[date],
    today: date,
    freezes: int,
) -> StreakUpdate:
    """
    Called when the user completes an XP-earning session today.

      same day                       -> unchanged
      last activity was yesterday    -> streak + 1
      missed exactly one day + freeze -> consume freeze, streak + 1
      anything else                  -> streak restarts at 1
    """
    before = displayed_streak(current, last_activity, today, freezes)

    if last_activity == today:
        return StreakUpdate(before, current, longest, extended=False, milestone=False)

    freeze_day: Optional[date] = None
    if last_activity == today - timedelta(days=1):
        after = current + 1
    elif last_activity == today - timedelta(days=2) and freezes > 0:
        after = current + 1
        freeze_day = today - timedelta(days=1)
    else:
        after = 1

    return StreakUpdate(
        before=before,
        after=after,
        longest=max(longest, after),
        extended=True,
        milestone=after in STREAK_MILESTONES,
        freeze_used_on=freeze_day,
    )


def displayed_streak(
    current: int, last_activity: Optional[date], today: date, freezes: int
) -> int:
    """
    What GET /me shows. A streak is still 'alive' if the user practised today or
    yesterday (or the day before, when a freeze would cover the gap). Otherwise 0.
    """
    if last_activity is None:
        return 0
    gap = (today - last_activity).days
    if gap <= 1:
        return current
    if gap == 2 and freezes > 0:
        return current
    return 0


def is_extended_today(last_activity: Optional[date], today: date) -> bool:
    """Flame is orange only after practising today."""
    return last_activity == today
