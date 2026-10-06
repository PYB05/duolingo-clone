"""
Central export for all models to ensure they are registered with SQLAlchemy's metadata.
"""

# Import Base first
from app.core.database import Base

# Import all models so that Base.metadata.create_all() finds them
from app.models.course import Course, Section, Unit
from app.models.skill import Skill, Lesson, Exercise, ExerciseOption, ExerciseAcceptedAnswer
from app.models.user import User, UserSettings, Enrollment
from app.models.progress import UserSkillProgress, LessonAttempt, AttemptAnswer
from app.models.gamification import (
    DailyActivity, XPEvent, GemTransaction, HeartEvent, ChestOpening,
    LeagueTier, LeagueGroup, LeagueMembership,
    QuestDefinition, UserQuestProgress,
    AchievementDefinition, AchievementTier, UserAchievement,
    ShopItem, Purchase
)

__all__ = [
    "Base",
    "Course", "Section", "Unit",
    "Skill", "Lesson", "Exercise", "ExerciseOption", "ExerciseAcceptedAnswer",
    "User", "UserSettings", "Enrollment",
    "UserSkillProgress", "LessonAttempt", "AttemptAnswer",
    "DailyActivity", "XPEvent", "GemTransaction", "HeartEvent", "ChestOpening",
    "LeagueTier", "LeagueGroup", "LeagueMembership",
    "QuestDefinition", "UserQuestProgress",
    "AchievementDefinition", "AchievementTier", "UserAchievement",
    "ShopItem", "Purchase"
]
