"""
Course content schema (part 1): courses -> sections -> units.

These tables are seeded once and are read-mostly.
"""

from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.skill import Skill


class Course(Base):
    """A language course, e.g. 'Spanish for English speakers'."""

    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    learning_language_code: Mapped[str] = mapped_column(String(10), nullable=False)
    from_language_code: Mapped[str] = mapped_column(String(10), nullable=False)
    flag_emoji: Mapped[str] = mapped_column(String(10), nullable=False, default="🇪🇸")
    description: Mapped[Optional[str]] = mapped_column(Text)

    sections: Mapped[List["Section"]] = relationship(
        back_populates="course", cascade="all, delete-orphan", order_by="Section.order_index"
    )


class Section(Base):
    """A big chunk of a course (Duolingo calls them 'Section 1', 'Section 2'...)."""

    __tablename__ = "sections"
    __table_args__ = (UniqueConstraint("course_id", "order_index", name="uix_course_section_order"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("courses.id", ondelete="CASCADE"), index=True, nullable=False
    )
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)

    course: Mapped["Course"] = relationship(back_populates="sections")
    units: Mapped[List["Unit"]] = relationship(
        back_populates="section", cascade="all, delete-orphan", order_by="Unit.order_index"
    )


class Unit(Base):
    """A themed group of skills with its own banner colour and guidebook."""

    __tablename__ = "units"
    __table_args__ = (UniqueConstraint("section_id", "order_index", name="uix_section_unit_order"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    section_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("sections.id", ondelete="CASCADE"), index=True, nullable=False
    )
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    theme_color: Mapped[str] = mapped_column(String(20), nullable=False)
    theme_shadow_color: Mapped[str] = mapped_column(String(20), nullable=False)
    guidebook_md: Mapped[Optional[str]] = mapped_column(Text)

    section: Mapped["Section"] = relationship(back_populates="units")
    skills: Mapped[List["Skill"]] = relationship(
        back_populates="unit", cascade="all, delete-orphan", order_by="Skill.order_index"
    )
