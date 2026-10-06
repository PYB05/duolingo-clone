"""
User schema: users, user_settings, enrollments.

`users` holds *denormalised* gamification totals (total_xp, gems, hearts, streak)
so `GET /me` is a single-row read. The event tables (xp_events, gem_transactions,
heart_events, daily_activity) are the audit trail / source of truth for history.
"""

from datetime import date, datetime
from typing import List, Optional

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint("daily_goal_xp IN (10, 20, 30, 50)", name="ck_user_daily_goal"),
        CheckConstraint("hearts BETWEEN 0 AND 5", name="ck_user_hearts"),
        CheckConstraint("gems >= 0", name="ck_user_gems"),
        CheckConstraint("total_xp >= 0", name="ck_user_xp"),
        CheckConstraint("streak_freezes BETWEEN 0 AND 2", name="ck_user_freezes"),
        CheckConstraint("league_tier BETWEEN 1 AND 10", name="ck_user_league_tier"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, index=True)
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255))
    avatar_color: Mapped[str] = mapped_column(String(20), nullable=False, default="#1CB0F6")
    is_bot: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    bot_xp_per_day: Mapped[Optional[int]] = mapped_column(Integer)
    timezone: Mapped[str] = mapped_column(String(50), nullable=False, default="Asia/Kolkata")
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    # Denormalised gamification state
    total_xp: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    gems: Mapped[int] = mapped_column(Integer, nullable=False, default=500)
    hearts: Mapped[int] = mapped_column(Integer, nullable=False, default=5)
    hearts_updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    current_streak: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    longest_streak: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_activity_date: Mapped[Optional[date]] = mapped_column(Date)
    streak_freezes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    daily_goal_xp: Mapped[int] = mapped_column(Integer, nullable=False, default=20)
    league_tier: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    settings: Mapped["UserSettings"] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    enrollments: Mapped[List["Enrollment"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class UserSettings(Base):
    __tablename__ = "user_settings"
    __table_args__ = (
        CheckConstraint("theme IN ('system','light','dark')", name="ck_settings_theme"),
    )

    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    sound_effects: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    animations: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    theme: Mapped[str] = mapped_column(String(20), nullable=False, default="system")
    listening_exercises: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    # Simulated clock offset in days (time travel for demos/tests)
    debug_day_offset: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    hearts_regen_seconds_override: Mapped[Optional[int]] = mapped_column(Integer)

    user: Mapped["User"] = relationship(back_populates="settings")


class Enrollment(Base):
    __tablename__ = "enrollments"
    __table_args__ = (UniqueConstraint("user_id", "course_id", name="uix_enrollment"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    course_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("courses.id", ondelete="CASCADE"), index=True, nullable=False
    )
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    user: Mapped["User"] = relationship(back_populates="enrollments")
