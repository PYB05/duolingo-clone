"""
Quests (Section 7.11).

Progress is *derived* from the event tables for the current period (today for
daily quests, this month for monthly ones) and snapshotted into
user_quest_progress, which also remembers completed_at / claimed_at.
"""

from dataclasses import dataclass
from datetime import date, datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core import clock
from app.core.errors import AppError, NotFoundError
from app.models.gamification import DailyActivity, QuestDefinition, UserQuestProgress
from app.models.progress import LessonAttempt
from app.models.user import User
from app.services import gem_service, xp_service


@dataclass
class QuestView:
    definition: QuestDefinition
    row: UserQuestProgress


def period_bounds(period: str, today: date) -> tuple[date, date]:
    """[start, end] dates of the quest period containing `today`."""
    if period == "daily":
        return today, today
    start = clock.month_start(today)
    next_month = (start.replace(day=28) + timedelta(days=4)).replace(day=1)
    return start, next_month - timedelta(days=1)


def _local_date(user: User, moment: datetime) -> date:
    return clock.as_aware(moment).astimezone(clock.local_now(user).tzinfo).date()


def count_perfect_lessons(db: Session, user: User, start: date, end: date) -> int:
    """Perfect, completed lessons whose (simulated, local) completion date is in range."""
    attempts = db.scalars(
        select(LessonAttempt).where(
            LessonAttempt.user_id == user.id,
            LessonAttempt.status == "completed",
            LessonAttempt.kind == "lesson",
            LessonAttempt.is_perfect.is_(True),
        )
    )
    return sum(
        1 for a in attempts if a.completed_at and start <= _local_date(user, a.completed_at) <= end
    )


def metric_value(db: Session, user: User, metric: str, start: date, end: date) -> int:
    if metric == "xp":
        return xp_service.xp_between(db, user.id, start, end)
    if metric == "lessons":
        total = db.scalar(
            select(func.coalesce(func.sum(DailyActivity.lessons_completed), 0)).where(
                DailyActivity.user_id == user.id,
                DailyActivity.activity_date >= start,
                DailyActivity.activity_date <= end,
            )
        )
        return int(total or 0)
    if metric == "perfect_lessons":
        return count_perfect_lessons(db, user, start, end)
    return 0


def refresh(db: Session, user: User) -> tuple[list[QuestView], list[QuestDefinition]]:
    """
    Recompute every quest for the current period.
    Returns (all quests, quests that became complete during this call).
    """
    today = clock.today(user)
    views: list[QuestView] = []
    newly_completed: list[QuestDefinition] = []

    for definition in db.scalars(select(QuestDefinition).order_by(QuestDefinition.id)):
        start, end = period_bounds(definition.period, today)
        row = db.scalar(
            select(UserQuestProgress).where(
                UserQuestProgress.user_id == user.id,
                UserQuestProgress.quest_id == definition.id,
                UserQuestProgress.period_start == start,
            )
        )
        if row is None:
            row = UserQuestProgress(user_id=user.id, quest_id=definition.id, period_start=start, progress=0)
            db.add(row)
        row.progress = min(definition.target, metric_value(db, user, definition.metric, start, end))
        if row.progress >= definition.target and row.completed_at is None:
            row.completed_at = clock.now(user)
            newly_completed.append(definition)
        views.append(QuestView(definition, row))
    db.flush()
    return views, newly_completed


def claim(db: Session, user: User, quest_id: int) -> QuestView:
    """Grant the quest's gem reward once."""
    views, _ = refresh(db, user)
    view = next((v for v in views if v.definition.id == quest_id), None)
    if view is None:
        raise NotFoundError("Quest")
    if view.row.completed_at is None:
        raise AppError("QUEST_NOT_COMPLETE", "Finish the quest before claiming it.", 409)
    if view.row.claimed_at is not None:
        raise AppError("ALREADY_CLAIMED", "Reward already claimed.", 409)
    view.row.claimed_at = clock.now(user)
    gem_service.change_gems(db, user, view.definition.reward_gems, "quest", ref_id=view.row.id)
    return view
