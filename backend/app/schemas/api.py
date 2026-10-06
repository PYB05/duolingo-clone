"""
Pydantic v2 schemas for the Duolingo Clone API.
Matches Section 10 of DUOLINGO_CLONE_SPEC.md.
"""

from datetime import date, datetime
from typing import Any, Optional
from pydantic import BaseModel, Field


# -----------------------------------------------------------------------------
# User & Settings
# -----------------------------------------------------------------------------
class UserSettingsSchema(BaseModel):
    sound_effects: bool
    animations: bool
    theme: str
    listening_exercises: bool
    debug_day_offset: int


class UpdateUserSettingsSchema(BaseModel):
    sound_effects: Optional[bool] = None
    animations: Optional[bool] = None
    theme: Optional[str] = None
    listening_exercises: Optional[bool] = None


class UserMeResponse(BaseModel):
    id: int
    username: str
    display_name: str
    avatar_color: str
    total_xp: int
    gems: int
    hearts: int
    next_heart_in_seconds: Optional[int]
    current_streak: int
    displayed_streak: int
    longest_streak: int
    is_streak_extended_today: bool
    today_xp: int
    daily_goal_xp: int
    streak_freezes: int
    league_tier: int
    settings: UserSettingsSchema
    simulated_today: str


class UpdateMeSchema(BaseModel):
    display_name: Optional[str] = None
    daily_goal_xp: Optional[int] = Field(None, description="Must be 10, 20, 30, or 50")


# -----------------------------------------------------------------------------
# Course & Learning Path
# -----------------------------------------------------------------------------
class SkillSummarySchema(BaseModel):
    id: int
    order_index: int
    kind: str  # skill | chest | unit_review
    title: str
    icon_key: Optional[str]
    total_levels: int
    lessons_completed: int
    state: str  # locked | available | in_progress | completed | legendary
    is_current: bool
    is_legendary: bool
    chest_opened: bool = False


class UnitSummarySchema(BaseModel):
    id: int
    order_index: int
    title: str
    description: Optional[str]
    theme_color: str
    theme_shadow_color: str
    has_guidebook: bool
    skills: list[SkillSummarySchema]


class SectionSummarySchema(BaseModel):
    id: int
    order_index: int
    title: str
    description: Optional[str]
    units: list[UnitSummarySchema]


class CourseResponse(BaseModel):
    id: int
    title: str
    learning_language_code: str
    from_language_code: str
    flag_emoji: str
    description: Optional[str]
    sections: list[SectionSummarySchema]


class GuidebookResponse(BaseModel):
    unit_id: int
    title: str
    guidebook_md: Optional[str]


class ChestOpenResponse(BaseModel):
    gems_awarded: int
    total_gems: int


# -----------------------------------------------------------------------------
# Exercises & Lesson Attempts
# -----------------------------------------------------------------------------
class SanitizedOptionSchema(BaseModel):
    id: int
    text: str
    emoji: Optional[str] = None
    side: Optional[str] = None


class SanitizedExerciseSchema(BaseModel):
    id: int
    type: str
    instruction: str
    prompt_text: Optional[str]
    prompt_language: Optional[str]
    target_language: Optional[str]
    sentence_with_blank: Optional[str]
    audio_text: Optional[str]
    emoji: Optional[str]
    options: list[SanitizedOptionSchema]


class StartLessonResponse(BaseModel):
    attempt_id: int
    kind: str
    hearts: int
    total_exercises: int
    exercises: list[SanitizedExerciseSchema]


class SubmitAnswerRequest(BaseModel):
    exercise_id: int
    answer: dict[str, Any]
    time_ms: int = 0


class SubmitAnswerResponse(BaseModel):
    is_correct: bool
    is_typo: bool
    note: Optional[str]
    correct_answer: str
    alternatives: list[str]
    explanation: Optional[str]
    hearts_remaining: int
    requeued: bool
    failed: bool
    progress: dict[str, int]


class CompleteAttemptResponse(BaseModel):
    xp: dict[str, int]
    gems: int
    accuracy: float
    duration_seconds: int
    is_perfect: bool
    streak: dict[str, Any]
    daily_goal: dict[str, Any]
    skill: Optional[dict[str, Any]]
    achievements_unlocked: list[dict[str, Any]]
    quests_completed: list[dict[str, Any]]


class StartPracticeRequest(BaseModel):
    kind: str = Field(..., description="hearts_practice | personalized | timed | legendary | unit_review")
    skill_id: Optional[int] = None


# -----------------------------------------------------------------------------
# Leaderboards
# -----------------------------------------------------------------------------
class StandingUserSchema(BaseModel):
    id: int
    display_name: str
    avatar_color: str
    is_current_user: bool


class StandingSchema(BaseModel):
    rank: int
    user: StandingUserSchema
    weekly_xp: int


class LeaderboardResponse(BaseModel):
    tier: int
    tier_name: str
    tier_color: str
    week_ends_at: str
    promotion_zone: int
    demotion_zone: int
    user_rank: int
    user_weekly_xp: int
    standings: list[StandingSchema]
    last_week_result: Optional[dict[str, Any]]


# -----------------------------------------------------------------------------
# Quests
# -----------------------------------------------------------------------------
class QuestItemSchema(BaseModel):
    id: int
    key: str
    title: str
    metric: str
    target: int
    progress: int
    reward_gems: int
    period: str
    is_completed: bool
    is_claimed: bool


class QuestsResponse(BaseModel):
    daily_quests: list[QuestItemSchema]
    monthly_quests: list[QuestItemSchema]


# -----------------------------------------------------------------------------
# Achievements
# -----------------------------------------------------------------------------
class AchievementTierSchema(BaseModel):
    tier_number: int
    threshold: int
    reward_gems: int
    is_unlocked: bool


class AchievementItemSchema(BaseModel):
    id: int
    key: str
    title: str
    description: str
    icon_key: str
    color_hex: str
    current_value: int
    current_tier: int
    max_tier: int
    next_threshold: Optional[int]
    tiers: list[AchievementTierSchema]


class AchievementsResponse(BaseModel):
    achievements: list[AchievementItemSchema]


# -----------------------------------------------------------------------------
# Shop
# -----------------------------------------------------------------------------
class ShopItemSchema(BaseModel):
    id: int
    key: str
    name: str
    description: str
    price_gems: int
    max_owned: Optional[int]
    owned_count: Optional[int]


class ShopResponse(BaseModel):
    gems: int
    items: list[ShopItemSchema]


class PurchaseRequest(BaseModel):
    pass


class PurchaseResponse(BaseModel):
    item_key: str
    price_paid: int
    new_gem_balance: int
    message: str


# -----------------------------------------------------------------------------
# Profile
# -----------------------------------------------------------------------------
class ProfileResponse(BaseModel):
    username: str
    display_name: str
    avatar_color: str
    joined_date: str
    day_streak: int
    total_xp: int
    current_league: str
    top_3_finishes: int
    weekly_xp_chart: list[dict[str, Any]]
    active_days: list[str]
    achievements_summary: list[dict[str, Any]]


# -----------------------------------------------------------------------------
# Dev Tools
# -----------------------------------------------------------------------------
class DevTimeTravelRequest(BaseModel):
    days: int


class DevSetHeartsRequest(BaseModel):
    hearts: int


class DevAddXPRequest(BaseModel):
    amount: int


class DevAddGemsRequest(BaseModel):
    amount: int
