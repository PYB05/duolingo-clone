"""
Achievements / badges (Section 7.9).

`evaluate(user)` recomputes each metric from the database, advances tiers whose
threshold is reached, grants their gem reward, and reports what was unlocked.
"""

from dataclasses import dataclass

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.core import clock
from app.models.gamification import (
    AchievementDefinition,
    DailyActivity,
    LeagueMembership,
    UserAchievement,
)
from app.models.progress import LessonAttempt, UserSkillProgress
from app.models.skill import Skill
from app.models.user import User
from app.services import gem_service


@dataclass
class Unlocked:
    key: str
    tier: int
    title: str
    reward_gems: int


def _completed_lessons_local_hours(db: Session, user: User) -> list[int]:
    """Local hour-of-day of every completed session (for Early Bird / Night Owl)."""
    tz = clock.local_now(user).tzinfo
    attempts = db.scalars(
        select(LessonAttempt.completed_at).where(
            LessonAttempt.user_id == user.id, LessonAttempt.status == "completed"
        )
    )
    return [clock.as_aware(t).astimezone(tz).hour for t in attempts if t is not None]


def metric_value(db: Session, user: User, metric: str) -> int:
    """Current value of an achievement metric for the user."""
    if metric == "streak":
        return user.longest_streak
    if metric == "total_xp":
        return user.total_xp
    if metric == "skills_completed":
        return int(
            db.scalar(
                select(func.count())
                .select_from(UserSkillProgress)
                .join(Skill, Skill.id == UserSkillProgress.skill_id)
                .where(
                    UserSkillProgress.user_id == user.id,
                    Skill.kind == "skill",
                    UserSkillProgress.lessons_completed >= Skill.total_levels,
                )
            )
            or 0
        )
    if metric == "perfect_lessons":
        return int(
            db.scalar(
                select(func.count()).select_from(LessonAttempt).where(
                    LessonAttempt.user_id == user.id,
                    LessonAttempt.kind == "lesson",
                    LessonAttempt.status == "completed",
                    LessonAttempt.is_perfect.is_(True),
                )
            )
            or 0
        )
    if metric == "promotions":
        return int(
            db.scalar(
                select(func.count()).select_from(LeagueMembership).where(
                    LeagueMembership.user_id == user.id, LeagueMembership.result == "promoted"
                )
            )
            or 0
        )
    if metric == "legendary":
        return int(
            db.scalar(
                select(func.count()).select_from(UserSkillProgress).where(
                    UserSkillProgress.user_id == user.id, UserSkillProgress.is_legendary.is_(True)
                )
            )
            or 0
        )
    if metric == "early_lessons":
        return sum(1 for h in _completed_lessons_local_hours(db, user) if h < 8)
    if metric == "late_lessons":
        return sum(1 for h in _completed_lessons_local_hours(db, user) if h >= 22)
    if metric == "double_goal_days":
        return int(
            db.scalar(
                select(func.count()).select_from(DailyActivity).where(
                    DailyActivity.user_id == user.id,
                    DailyActivity.xp_earned >= 2 * user.daily_goal_xp,
                )
            )
            or 0
        )
    return 0


def evaluate(db: Session, user: User, grant_rewards: bool = True) -> list[Unlocked]:
    """Update every achievement for the user and return newly unlocked tiers."""
    unlocked: list[Unlocked] = []
    definitions = db.scalars(
        select(AchievementDefinition).options(selectinload(AchievementDefinition.tiers))
    ).all()
    existing = {
        ua.achievement_id: ua
        for ua in db.scalars(select(UserAchievement).where(UserAchievement.user_id == user.id))
    }

    for definition in definitions:
        row = existing.get(definition.id)
        if row is None:
            row = UserAchievement(user_id=user.id, achievement_id=definition.id, progress_value=0, tier_unlocked=0)
            db.add(row)
        row.progress_value = metric_value(db, user, definition.metric)
        for tier in definition.tiers:
            if tier.tier_number > row.tier_unlocked and row.progress_value >= tier.threshold:
                row.tier_unlocked = tier.tier_number
                row.last_unlocked_at = clock.now(user)
                if grant_rewards and tier.reward_gems > 0:
                    gem_service.change_gems(db, user, tier.reward_gems, "achievement", ref_id=tier.id)
                unlocked.append(
                    Unlocked(
                        key=definition.key,
                        tier=tier.tier_number,
                        title=f"{definition.title} — Level {tier.tier_number}",
                        reward_gems=tier.reward_gems,
                    )
                )
    db.flush()
    return unlocked
