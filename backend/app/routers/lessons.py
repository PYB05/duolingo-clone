"""
Lesson attempt execution endpoints.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.api import CompleteAttemptResponse, SanitizedExerciseSchema, SanitizedOptionSchema, StartLessonResponse, SubmitAnswerRequest, SubmitAnswerResponse
from app.services import lesson_service

router = APIRouter(tags=["lessons"])


@router.post("/lessons/{lesson_id}/start", response_model=StartLessonResponse)
def start_lesson(
    lesson_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Start a lesson attempt. Returns sanitized exercises."""
    attempt, exercises = lesson_service.start_lesson_attempt(db, user, lesson_id)
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


@router.post("/attempts/{attempt_id}/answer", response_model=SubmitAnswerResponse)
def submit_answer(
    attempt_id: int,
    payload: SubmitAnswerRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit an answer to an active exercise. Requeues mistakes and adjusts hearts."""
    result = lesson_service.submit_answer(
        db,
        user,
        attempt_id=attempt_id,
        exercise_id=payload.exercise_id,
        submitted_answer=payload.answer,
        time_ms=payload.time_ms,
    )
    db.commit()
    return SubmitAnswerResponse(**result)


@router.post("/attempts/{attempt_id}/skip", response_model=SubmitAnswerResponse)
def skip_exercise(
    attempt_id: int,
    exercise_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Skip an exercise (treated as incorrect, costs a heart in normal lessons)."""
    result = lesson_service.skip_exercise(db, user, attempt_id, exercise_id)
    db.commit()
    return SubmitAnswerResponse(**result)


@router.post("/attempts/{attempt_id}/complete", response_model=CompleteAttemptResponse)
def complete_attempt(
    attempt_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Complete a lesson or practice attempt. Awards XP, updates streak, unlocks, quests."""
    result = lesson_service.complete_attempt(db, user, attempt_id)
    db.commit()
    return CompleteAttemptResponse(**result)


@router.post("/attempts/{attempt_id}/abandon")
def abandon_attempt(
    attempt_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Abandon an in-progress attempt."""
    res = lesson_service.abandon_attempt(db, user, attempt_id)
    db.commit()
    return res
