"""
Unlock & progression rules (Section 7.10).

Skills are walked in global order (section -> unit -> skill). Only `kind == "skill"`
nodes gate progression; chests and unit reviews unlock when the skill before them
is complete but never block what comes after.
"""

from dataclasses import dataclass
from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.course import Course, Section, Unit
from app.models.gamification import ChestOpening
from app.models.progress import UserSkillProgress
from app.models.skill import Skill

LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED, LEGENDARY = (
    "locked",
    "available",
    "in_progress",
    "completed",
    "legendary",
)


@dataclass
class NodeInput:
    skill_id: int
    kind: str
    total_levels: int
    lessons_completed: int = 0
    is_legendary: bool = False
    chest_opened: bool = False


@dataclass
class NodeState:
    skill_id: int
    state: str
    is_current: bool = False


def compute_states(nodes: list[NodeInput]) -> list[NodeState]:
    """Pure function: ordered nodes + progress -> state per node."""
    results: list[NodeState] = []
    previous_skill_done = True  # the very first skill is always unlocked
    current_assigned = False

    for node in nodes:
        if node.kind == "skill":
            done = node.lessons_completed >= node.total_levels
            if done:
                state = LEGENDARY if node.is_legendary else COMPLETED
            elif previous_skill_done:
                state = IN_PROGRESS if node.lessons_completed > 0 else AVAILABLE
            else:
                state = LOCKED
            is_current = state in (AVAILABLE, IN_PROGRESS) and not current_assigned
            current_assigned = current_assigned or is_current
            results.append(NodeState(node.skill_id, state, is_current))
            previous_skill_done = done
        elif node.kind == "chest":
            if node.chest_opened:
                state = COMPLETED
            else:
                state = AVAILABLE if previous_skill_done else LOCKED
            results.append(NodeState(node.skill_id, state))
        else:  # unit_review
            if node.lessons_completed >= 1:
                state = COMPLETED
            else:
                state = AVAILABLE if previous_skill_done else LOCKED
            results.append(NodeState(node.skill_id, state))
    return results


# ---------------------------------------------------------------------------
# DB helpers
# ---------------------------------------------------------------------------
def load_course(db: Session, course_id: Optional[int] = None) -> Course:
    """Load the course tree in a handful of queries (selectinload avoids N+1)."""
    stmt = select(Course).options(
        selectinload(Course.sections)
        .selectinload(Section.units)
        .selectinload(Unit.skills)
        .selectinload(Skill.lessons)
    )
    if course_id is not None:
        stmt = stmt.where(Course.id == course_id)
    course = db.scalars(stmt.order_by(Course.id)).first()
    if course is None:
        raise LookupError("No course seeded")
    return course


def ordered_skills(course: Course) -> list[Skill]:
    return [skill for section in course.sections for unit in section.units for skill in unit.skills]


def progress_map(db: Session, user_id: int) -> dict[int, UserSkillProgress]:
    rows = db.scalars(select(UserSkillProgress).where(UserSkillProgress.user_id == user_id))
    return {row.skill_id: row for row in rows}


def opened_chests(db: Session, user_id: int) -> set[int]:
    return set(db.scalars(select(ChestOpening.skill_id).where(ChestOpening.user_id == user_id)))


def states_for_user(db: Session, user_id: int, course: Optional[Course] = None) -> dict[int, NodeState]:
    """skill_id -> NodeState for the user's whole course."""
    course = course or load_course(db)
    progress = progress_map(db, user_id)
    chests = opened_chests(db, user_id)
    nodes = []
    for skill in ordered_skills(course):
        p = progress.get(skill.id)
        nodes.append(
            NodeInput(
                skill_id=skill.id,
                kind=skill.kind,
                total_levels=skill.total_levels,
                lessons_completed=p.lessons_completed if p else 0,
                is_legendary=p.is_legendary if p else False,
                chest_opened=skill.id in chests,
            )
        )
    return {s.skill_id: s for s in compute_states(nodes)}


def get_or_create_progress(db: Session, user_id: int, skill_id: int) -> UserSkillProgress:
    row = db.scalar(
        select(UserSkillProgress).where(
            UserSkillProgress.user_id == user_id, UserSkillProgress.skill_id == skill_id
        )
    )
    if row is None:
        row = UserSkillProgress(user_id=user_id, skill_id=skill_id, lessons_completed=0, is_legendary=False)
        db.add(row)
        db.flush()
    return row


def next_skill_id(course: Course, skill_id: int) -> Optional[int]:
    """The next lesson-skill after `skill_id` in path order (for the 'unlocked' animation)."""
    skills = [s for s in ordered_skills(course) if s.kind == "skill"]
    for index, skill in enumerate(skills):
        if skill.id == skill_id and index + 1 < len(skills):
            return skills[index + 1].id
    return None
