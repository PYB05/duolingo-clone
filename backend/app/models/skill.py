"""
Course content schema (part 2): skills -> lessons -> exercises -> options / accepted answers.
"""

from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.course import Unit

SKILL_KINDS = ("skill", "chest", "unit_review")
EXERCISE_TYPES = (
    "multiple_choice",
    "translate_word_bank",
    "match_pairs",
    "fill_in_blank",
    "type_answer",
    "listen_tap",
    "listen_type",
    "speak",
)


def _in(column: str, values: tuple[str, ...]) -> str:
    """Build a SQL `col IN ('a','b')` string for CHECK constraints."""
    quoted = ",".join(f"'{v}'" for v in values)
    return f"{column} IN ({quoted})"


class Skill(Base):
    """A node on the learning path. `kind` decides if it is a lesson skill, chest or review."""

    __tablename__ = "skills"
    __table_args__ = (
        UniqueConstraint("unit_id", "order_index", name="uix_unit_skill_order"),
        CheckConstraint(_in("kind", SKILL_KINDS), name="ck_skill_kind"),
        CheckConstraint("total_levels >= 1", name="ck_skill_levels"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    unit_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("units.id", ondelete="CASCADE"), index=True, nullable=False
    )
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    kind: Mapped[str] = mapped_column(String(20), nullable=False)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    icon_key: Mapped[Optional[str]] = mapped_column(String(50))
    total_levels: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    unit: Mapped["Unit"] = relationship(back_populates="skills")
    lessons: Mapped[List["Lesson"]] = relationship(
        back_populates="skill", cascade="all, delete-orphan", order_by="Lesson.level_number"
    )


class Lesson(Base):
    """One level of a skill (a skill with 3 levels has 3 lessons)."""

    __tablename__ = "lessons"
    __table_args__ = (UniqueConstraint("skill_id", "level_number", name="uix_skill_lesson_level"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    skill_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("skills.id", ondelete="CASCADE"), index=True, nullable=False
    )
    level_number: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[Optional[str]] = mapped_column(String(100))
    xp_reward: Mapped[int] = mapped_column(Integer, nullable=False, default=10)

    skill: Mapped["Skill"] = relationship(back_populates="lessons")
    exercises: Mapped[List["Exercise"]] = relationship(
        back_populates="lesson", cascade="all, delete-orphan", order_by="Exercise.order_index"
    )


class Exercise(Base):
    """A single question inside a lesson."""

    __tablename__ = "exercises"
    __table_args__ = (
        UniqueConstraint("lesson_id", "order_index", name="uix_lesson_exercise_order"),
        CheckConstraint(_in("type", EXERCISE_TYPES), name="ck_exercise_type"),
        CheckConstraint("difficulty BETWEEN 1 AND 3", name="ck_exercise_difficulty"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    lesson_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("lessons.id", ondelete="CASCADE"), index=True, nullable=False
    )
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    type: Mapped[str] = mapped_column(String(30), nullable=False)
    instruction: Mapped[str] = mapped_column(String(200), nullable=False)
    prompt_text: Mapped[Optional[str]] = mapped_column(Text)
    prompt_language: Mapped[Optional[str]] = mapped_column(String(10))
    target_language: Mapped[Optional[str]] = mapped_column(String(10))
    sentence_with_blank: Mapped[Optional[str]] = mapped_column(Text)
    correct_answer: Mapped[Optional[str]] = mapped_column(Text)
    audio_text: Mapped[Optional[str]] = mapped_column(Text)
    audio_url: Mapped[Optional[str]] = mapped_column(String(255))
    emoji: Mapped[Optional[str]] = mapped_column(String(20))
    explanation: Mapped[Optional[str]] = mapped_column(Text)
    difficulty: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    lesson: Mapped["Lesson"] = relationship(back_populates="exercises")
    options: Mapped[List["ExerciseOption"]] = relationship(
        back_populates="exercise", cascade="all, delete-orphan", order_by="ExerciseOption.order_index"
    )
    accepted_answers: Mapped[List["ExerciseAcceptedAnswer"]] = relationship(
        back_populates="exercise", cascade="all, delete-orphan"
    )


class ExerciseOption(Base):
    """
    A selectable item of an exercise. One table serves every exercise type:
      - choice / blank: `is_correct`
      - word bank: `correct_position` (NULL = distractor)
      - match pairs: `pair_group` + `side`
    """

    __tablename__ = "exercise_options"
    __table_args__ = (
        CheckConstraint("side IS NULL OR side IN ('left','right')", name="ck_option_side"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    exercise_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("exercises.id", ondelete="CASCADE"), index=True, nullable=False
    )
    order_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    emoji: Mapped[Optional[str]] = mapped_column(String(20))
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    correct_position: Mapped[Optional[int]] = mapped_column(Integer)
    pair_group: Mapped[Optional[int]] = mapped_column(Integer)
    side: Mapped[Optional[str]] = mapped_column(String(10))

    exercise: Mapped["Exercise"] = relationship(back_populates="options")


class ExerciseAcceptedAnswer(Base):
    """Alternative correct answers for typed / word-bank exercises."""

    __tablename__ = "exercise_accepted_answers"
    __table_args__ = (
        UniqueConstraint("exercise_id", "answer_text", name="uix_exercise_accepted_answer"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    exercise_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("exercises.id", ondelete="CASCADE"), index=True, nullable=False
    )
    answer_text: Mapped[str] = mapped_column(Text, nullable=False)

    exercise: Mapped["Exercise"] = relationship(back_populates="accepted_answers")
