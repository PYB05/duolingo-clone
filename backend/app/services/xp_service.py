"""
XP rules (Section 7.3) + daily activity / daily goal bookkeeping (Section 7.6).

`xp_events` is the source of truth; `users.total_xp` is a running total updated
in the same transaction for cheap reads.
"""

from dataclasses import dataclass
from datetime import date, timedelta
from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core import clock
from app.models.gamification import DailyActivity, XPEvent
from app.models.user import User

LESSON_BASE_XP = 10
PERFECT_BONUS_XP = 5
PRACTICE_XP = 5
LEGENDARY_XP = 40
TIMED_XP_CAP = 30
DAILY_GOAL_OPTIONS = (10, 20, 30, 50)


@dataclass
class XPBreakdown:
    base: int
    perfect_bonus: int

    @property
    def total(self) -> int:
        return self.base + self.perfect_bonus


def compute_xp(kind: str, mistakes: int, lesson_xp: int = LESSON_BASE_XP, timed_score: int = 0) -> XPBreakdown:
    """
    XP for finishing a session:
      lesson      10 (+5 if no mistakes)
      practice     5  (hearts / personalised / unit review)
      legendary   40
      timed       2 x correct answers, capped at 30
    """
    if kind == "lesson":
        return XPBreakdown(lesson_xp, PERFECT_BONUS_XP if mistakes == 0 else 0)
    if kind == "legendary":
        return XPBreakdown(LEGENDARY_XP, 0)
    if kind == "timed":
        return XPBreakdown(min(2 * timed_score, TIMED_XP_CAP), 0)
    return XPBreakdown(PRACTICE_XP, 0)


def xp_source_for(kind: str) -> str:
    if kind == "lesson":
        return "lesson"
    if kind in ("legendary", "timed"):
        return kind
    return "practice"


# ---------------------------------------------------------------------------
# Queries
# ---------------------------------------------------------------------------
def xp_between(db: Session, user_id: int, start: date, end: date) -> int:
    """Sum of XP with activity_date in [start, end]."""
    total = db.scalar(
        select(func.coalesce(func.sum(XPEvent.amount), 0)).where(
            XPEvent.user_id == user_id,
            XPEvent.activity_date >= start,
            XPEvent.activity_date <= end,
        )
    )
    return int(total or 0)


def today_xp(db: Session, user: User) -> int:
    day = clock.today(user)
    return xp_between(db, user.id, day, day)


def daily_xp_series(db: Session, user: User, days: int = 7) -> list[tuple[date, int]]:
    """XP per day for the last `days` days (oldest first) — profile chart."""
    end = clock.today(user)
    start = end - timedelta(days=days - 1)
    rows = db.execute(
        select(XPEvent.activity_date, func.sum(XPEvent.amount))
        .where(XPEvent.user_id == user.id, XPEvent.activity_date >= start, XPEvent.activity_date <= end)
        .group_by(XPEvent.activity_date)
    ).all()
    by_day = {row[0]: int(row[1]) for row in rows}
    return [(start + timedelta(days=i), by_day.get(start + timedelta(days=i), 0)) for i in range(days)]


# ---------------------------------------------------------------------------
# Mutations
# ---------------------------------------------------------------------------
def award_xp(
    db: Session, user: User, amount: int, source: str, attempt_id: Optional[int] = None
) -> None:
    """Write an xp_event and bump the denormalised total."""
    if amount <= 0:
        return
    db.add(
        XPEvent(
            user_id=user.id,
            amount=amount,
            source=source,
            attempt_id=attempt_id,
            activity_date=clock.today(user),
            created_at=clock.utc_now(),
        )
    )
    user.total_xp += amount


def get_or_create_activity(db: Session, user_id: int, day: date) -> DailyActivity:
    row = db.get(DailyActivity, (user_id, day))
    if row is None:
        row = DailyActivity(
            user_id=user_id, activity_date=day, xp_earned=0, lessons_completed=0,
            goal_met=False, streak_freeze_used=False,
        )
        db.add(row)
    return row


@dataclass
class DailyGoalResult:
    goal: int
    today_xp: int
    just_reached: bool


def record_activity(db: Session, user: User, xp: int, completed_session: bool) -> DailyGoalResult:
    """Add XP (and optionally a completed lesson) to today's daily_activity row."""
    day = clock.today(user)
    row = get_or_create_activity(db, user.id, day)
    was_met = row.goal_met
    row.xp_earned += xp
    if completed_session:
        row.lessons_completed += 1
    row.goal_met = row.xp_earned >= user.daily_goal_xp
    return DailyGoalResult(user.daily_goal_xp, row.xp_earned, row.goal_met and not was_met)
