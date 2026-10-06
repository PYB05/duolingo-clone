"""
Practice modes router.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.api import SanitizedExerciseSchema, SanitizedOptionSchema, StartLessonResponse, StartPracticeRequest
from app.services import lesson_service

router = APIRouter(prefix="/practice", tags=["practice"])


@router.post("/start", response_model=StartLessonResponse)
def start_practice(
    payload: StartPracticeRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Start a practice session (hearts_practice, personalized, timed, legendary, unit_review)."""
    attempt, exercises = lesson_service.start_practice_attempt(
        db, user, kind=payload.kind, skill_id=payload.skill_id
    )
    db.commit()

    return StartLessonResponse(
        attempt_id=attempt.id,
        kind=attempt.kind,
        hearts=user.hearts,
        total_exercises=attempt.total_exercises,
        exercises=[
            SanitizedExerciseSchema(
                id=e.id,
                type=e.type,
                instruction=e.instruction,
                prompt_text=e.prompt_text,
                prompt_language=e.prompt_language,
                target_language=e.target_language,
                sentence_with_blank=e.sentence_with_blank,
                audio_text=e.audio_text,
                emoji=e.emoji,
                options=[
                    SanitizedOptionSchema(
                        id=o.id,
                        text=o.text,
                        emoji=o.emoji,
                        side=o.side,
                    )
                    for o in e.options
                ],
            )
            for e in exercises
        ],
    )
