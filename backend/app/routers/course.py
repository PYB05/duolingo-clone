"""
Course curriculum and learning path router.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core import clock
from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.errors import AppError, NotFoundError
from app.models.course import Unit
from app.models.gamification import ChestOpening
from app.models.skill import Skill
from app.models.user import User
from app.schemas.api import ChestOpenResponse, CourseResponse, GuidebookResponse, SectionSummarySchema, SkillSummarySchema, UnitSummarySchema
from app.services import gem_service, unlock_service

router = APIRouter(tags=["course"])


@router.get("/course", response_model=CourseResponse)
def get_course(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetch full path: sections -> units -> skills with computed states and unlock rings."""
    course = unlock_service.load_course(db)
    states = unlock_service.states_for_user(db, user.id, course)
    progress_map = unlock_service.progress_map(db, user.id)
    opened_chests = unlock_service.opened_chests(db, user.id)

    sections_out: list[SectionSummarySchema] = []
    for section in course.sections:
        units_out: list[UnitSummarySchema] = []
        for unit in section.units:
            skills_out: list[SkillSummarySchema] = []
            for skill in unit.skills:
                node_st = states.get(skill.id)
                prog = progress_map.get(skill.id)
                lessons_done = prog.lessons_completed if prog else 0
                is_legendary = prog.is_legendary if prog else False

                skills_out.append(
                    SkillSummarySchema(
                        id=skill.id,
                        order_index=skill.order_index,
                        kind=skill.kind,
                        title=skill.title,
                        icon_key=skill.icon_key,
                        total_levels=skill.total_levels,
                        lessons_completed=lessons_done,
                        state=node_st.state if node_st else unlock_service.LOCKED,
                        is_current=node_st.is_current if node_st else False,
                        is_legendary=is_legendary,
                        chest_opened=skill.id in opened_chests,
                    )
                )

            units_out.append(
                UnitSummarySchema(
                    id=unit.id,
                    order_index=unit.order_index,
                    title=unit.title,
                    description=unit.description,
                    theme_color=unit.theme_color,
                    theme_shadow_color=unit.theme_shadow_color,
                    has_guidebook=bool(unit.guidebook_md),
                    skills=skills_out,
                )
            )

        sections_out.append(
            SectionSummarySchema(
                id=section.id,
                order_index=section.order_index,
                title=section.title,
                description=section.description,
                units=units_out,
            )
        )

    return CourseResponse(
        id=course.id,
        title=course.title,
        learning_language_code=course.learning_language_code,
        from_language_code=course.from_language_code,
        flag_emoji=course.flag_emoji,
        description=course.description,
        sections=sections_out,
    )


@router.get("/units/{unit_id}/guide", response_model=GuidebookResponse)
def get_unit_guidebook(unit_id: int, db: Session = Depends(get_db)):
    """Fetch guidebook markdown for a unit."""
    unit = db.get(Unit, unit_id)
    if unit is None:
        raise NotFoundError("Unit")
    return GuidebookResponse(unit_id=unit.id, title=unit.title, guidebook_md=unit.guidebook_md)


@router.post("/chests/{skill_id}/open", response_model=ChestOpenResponse)
def open_chest(skill_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Open a path chest and receive 20 gems reward (once per user per chest)."""
    skill = db.get(Skill, skill_id)
    if skill is None or skill.kind != "chest":
        raise NotFoundError("Chest")

    opened = unlock_service.opened_chests(db, user.id)
    if skill_id in opened:
        raise AppError("CHEST_ALREADY_OPENED", "This chest has already been opened.", 409)

    states = unlock_service.states_for_user(db, user.id)
    st = states.get(skill_id)
    if not st or st.state == unlock_service.LOCKED:
        raise AppError("CHEST_LOCKED", "Complete preceding skills to unlock this chest.", 403)

    gems_awarded = 20
    db.add(
        ChestOpening(
            user_id=user.id,
            skill_id=skill.id,
            gems_awarded=gems_awarded,
            opened_at=clock.utc_now(),
        )
    )
    new_balance = gem_service.change_gems(db, user, gems_awarded, "chest", ref_id=skill.id)
    db.commit()

    return ChestOpenResponse(gems_awarded=gems_awarded, total_gems=new_balance)
