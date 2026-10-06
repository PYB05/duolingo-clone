"""
Gamification schema: event logs, chests, leagues, quests, achievements, shop.

Event tables (xp_events, gem_transactions, heart_events, daily_activity) are
append-only history. They let us compute "XP today", "XP this week", calendars
and quest progress without trusting the denormalised totals on `users`.
"""

from datetime import date, datetime
from typing import List, Optional

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


# ---------------------------------------------------------------------------
# Activity / currency event logs
# ---------------------------------------------------------------------------
class DailyActivity(Base):
    """One row per user per (simulated) day they practised. Drives streak calendar."""

    __tablename__ = "daily_activity"

    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    activity_date: Mapped[date] = mapped_column(Date, primary_key=True)
    xp_earned: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    lessons_completed: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    goal_met: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    streak_freeze_used: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)


class XPEvent(Base):
    __tablename__ = "xp_events"
    __table_args__ = (
        Index("ix_xp_events_user_date", "user_id", "activity_date"),
        CheckConstraint(
            "source IN ('lesson','practice','legendary','timed','bonus')", name="ck_xp_source"
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    amount: Mapped[int] = mapped_column(Integer, nullable=False)
    source: Mapped[str] = mapped_column(String(20), nullable=False)
    attempt_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("lesson_attempts.id", ondelete="SET NULL"), index=True
    )
    activity_date: Mapped[date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class GemTransaction(Base):
    __tablename__ = "gem_transactions"
    __table_args__ = (
        CheckConstraint(
            "reason IN ('chest','quest','achievement','purchase','seed','dev','lesson')",
            name="ck_gem_reason",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    delta: Mapped[int] = mapped_column(Integer, nullable=False)
    reason: Mapped[str] = mapped_column(String(20), nullable=False)
    ref_id: Mapped[Optional[int]] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class HeartEvent(Base):
    __tablename__ = "heart_events"
    __table_args__ = (
        CheckConstraint(
            "reason IN ('wrong_answer','regen','refill','practice','dev')", name="ck_heart_reason"
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    delta: Mapped[int] = mapped_column(Integer, nullable=False)
    reason: Mapped[str] = mapped_column(String(20), nullable=False)
    attempt_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("lesson_attempts.id", ondelete="SET NULL"), index=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class ChestOpening(Base):
    """A chest node can be opened once per user (UNIQUE enforces the one-time reward)."""

    __tablename__ = "chest_openings"
    __table_args__ = (UniqueConstraint("user_id", "skill_id", name="uix_chest_opening"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    skill_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("skills.id", ondelete="CASCADE"), index=True, nullable=False
    )
    gems_awarded: Mapped[int] = mapped_column(Integer, nullable=False)
    opened_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


# ---------------------------------------------------------------------------
# Leagues
# ---------------------------------------------------------------------------
class LeagueTier(Base):
    __tablename__ = "league_tiers"

    tier: Mapped[int] = mapped_column(Integer, primary_key=True)  # 1..10
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    color_hex: Mapped[str] = mapped_column(String(20), nullable=False)


class LeagueGroup(Base):
    """A 30-person weekly competition bucket in one tier."""

    __tablename__ = "league_groups"
    __table_args__ = (Index("ix_league_groups_week_tier", "week_start", "tier"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    week_start: Mapped[date] = mapped_column(Date, nullable=False)
    tier: Mapped[int] = mapped_column(Integer, ForeignKey("league_tiers.tier"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    memberships: Mapped[List["LeagueMembership"]] = relationship(
        back_populates="group", cascade="all, delete-orphan"
    )


class LeagueMembership(Base):
    __tablename__ = "league_memberships"
    __table_args__ = (
        UniqueConstraint("group_id", "user_id", name="uix_league_membership"),
        Index("ix_league_memberships_group_xp", "group_id", "weekly_xp"),
        CheckConstraint(
            "result IN ('pending','promoted','stayed','demoted')", name="ck_membership_result"
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    group_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("league_groups.id", ondelete="CASCADE"), index=True, nullable=False
    )
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    weekly_xp: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    final_rank: Mapped[Optional[int]] = mapped_column(Integer)
    result: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    result_seen: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    group: Mapped["LeagueGroup"] = relationship(back_populates="memberships")


# ---------------------------------------------------------------------------
# Quests
# ---------------------------------------------------------------------------
class QuestDefinition(Base):
    __tablename__ = "quest_definitions"
    __table_args__ = (
        CheckConstraint("metric IN ('xp','lessons','perfect_lessons')", name="ck_quest_metric"),
        CheckConstraint("period IN ('daily','monthly')", name="ck_quest_period"),
        CheckConstraint("target > 0", name="ck_quest_target"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    key: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    metric: Mapped[str] = mapped_column(String(20), nullable=False)
    target: Mapped[int] = mapped_column(Integer, nullable=False)
    reward_gems: Mapped[int] = mapped_column(Integer, nullable=False)
    period: Mapped[str] = mapped_column(String(20), nullable=False)


class UserQuestProgress(Base):
    __tablename__ = "user_quest_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "quest_id", "period_start", name="uix_user_quest_period"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    quest_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("quest_definitions.id", ondelete="CASCADE"), index=True, nullable=False
    )
    period_start: Mapped[date] = mapped_column(Date, nullable=False)
    progress: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    claimed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    quest: Mapped["QuestDefinition"] = relationship()


# ---------------------------------------------------------------------------
# Achievements
# ---------------------------------------------------------------------------
class AchievementDefinition(Base):
    __tablename__ = "achievement_definitions"

    id: Mapped[int] = mapped_column(primary_key=True)
    key: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    metric: Mapped[str] = mapped_column(String(50), nullable=False)
    icon_key: Mapped[str] = mapped_column(String(50), nullable=False)
    color_hex: Mapped[str] = mapped_column(String(20), nullable=False, default="#FF9600")

    tiers: Mapped[List["AchievementTier"]] = relationship(
        back_populates="achievement",
        cascade="all, delete-orphan",
        order_by="AchievementTier.tier_number",
    )


class AchievementTier(Base):
    __tablename__ = "achievement_tiers"
    __table_args__ = (
        UniqueConstraint("achievement_id", "tier_number", name="uix_achievement_tier"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    achievement_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("achievement_definitions.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    tier_number: Mapped[int] = mapped_column(Integer, nullable=False)
    threshold: Mapped[int] = mapped_column(Integer, nullable=False)
    reward_gems: Mapped[int] = mapped_column(Integer, nullable=False)

    achievement: Mapped["AchievementDefinition"] = relationship(back_populates="tiers")


class UserAchievement(Base):
    __tablename__ = "user_achievements"
    __table_args__ = (UniqueConstraint("user_id", "achievement_id", name="uix_user_achievement"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    achievement_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("achievement_definitions.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    progress_value: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    tier_unlocked: Mapped[int] = mapped_column(Integer, nullable=False, default=0)  # 0 = none
    last_unlocked_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))


# ---------------------------------------------------------------------------
# Shop
# ---------------------------------------------------------------------------
class ShopItem(Base):
    __tablename__ = "shop_items"
    __table_args__ = (CheckConstraint("price_gems >= 0", name="ck_shop_price"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    key: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    price_gems: Mapped[int] = mapped_column(Integer, nullable=False)
    max_owned: Mapped[Optional[int]] = mapped_column(Integer)
    is_available: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class Purchase(Base):
    __tablename__ = "purchases"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    shop_item_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("shop_items.id", ondelete="CASCADE"), index=True, nullable=False
    )
    price_paid: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
