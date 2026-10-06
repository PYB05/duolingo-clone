"""
Progress schema: user_skill_progress, lesson_attempts, attempt_answers.
"""

from datetime import datetime
from typing import Any, List, Optional

from sqlalchemy import (
    JSON,
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    UniqueConstraint,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

ATTEMPT_KINDS = ("lesson", "hearts_practice", "personalized", "timed", "legendary", "unit_review")
ATTEMPT_STATUSES = ("in_progress", "completed", "failed", "abandoned")


class UserSkillProgress(Base):
    """How far a user got in a skill (levels done, legendary)."""

    __tablename__ = "user_skill_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "skill_id", name="uix_user_skill_progress"),
        CheckConstraint("lessons_completed >= 0", name="ck_usp_lessons"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    skill_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("skills.id", ondelete="CASCADE"), index=True, nullable=False
    )
    lessons_completed: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_legendary: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    unlocked_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    last_practiced_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))


class LessonAttempt(Base):
    """One play-through of a lesson or practice session. Server-authoritative state lives here."""

    __tablename__ = "lesson_attempts"
    __table_args__ = (
        CheckConstraint(
            "kind IN (" + ",".join(f"'{k}'" for k in ATTEMPT_KINDS) + ")", name="ck_attempt_kind"
        ),
        CheckConstraint(
            "status IN (" + ",".join(f"'{s}'" for s in ATTEMPT_STATUSES) + ")",
            name="ck_attempt_status",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    lesson_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("lessons.id", ondelete="SET NULL"), index=True
    )
    skill_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("skills.id", ondelete="SET NULL"), index=True
    )
    kind: Mapped[str] = mapped_column(String(20), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="in_progress")
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    total_exercises: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    correct_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    mistakes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    hearts_lost: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_perfect: Mapped[Optional[bool]] = mapped_column(Boolean)
    xp_earned: Mapped[Optional[int]] = mapped_column(Integer)
    gems_earned: Mapped[Optional[int]] = mapped_column(Integer)
    duration_seconds: Mapped[Optional[int]] = mapped_column(Integer)
    # Remaining exercise ids to answer (wrong answers get appended again)
    queue_json: Mapped[Optional[List[int]]] = mapped_column(JSON)
    # Free-form per-mode data: all exercise ids, timer score, etc.
    meta_json: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON)

    answers: Mapped[List["AttemptAnswer"]] = relationship(
        back_populates="attempt", cascade="all, delete-orphan"
    )


class AttemptAnswer(Base):
    """Every answer submitted in an attempt (used for personalised practice + analytics)."""

    __tablename__ = "attempt_answers"

    id: Mapped[int] = mapped_column(primary_key=True)
    attempt_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("lesson_attempts.id", ondelete="CASCADE"), index=True, nullable=False
    )
    exercise_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("exercises.id", ondelete="SET NULL"), index=True
    )
    submitted_answer_json: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON)
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False)
    is_typo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    time_ms: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    answered_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    attempt: Mapped["LessonAttempt"] = relationship(back_populates="answers")
