"""
Lesson attempt lifecycle and practice modes service.

Handles:
  - Starting normal lesson attempts with validation (unlock status, heart check)
  - Starting practice modes (hearts practice, personalized, timed, legendary, unit review)
  - Submitting answers with real-time checking, heart loss, and mistake re-queuing
  - Completing attempts in a single transactional unit with streak, XP, quests, achievements
  - Abandoning attempts
"""

import random
from dataclasses import dataclass
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core import clock
from app.core.errors import AlreadyCompletedError, AppError, LockedError, NotFoundError, OutOfHeartsError
from app.models.course import Course
from app.models.progress import AttemptAnswer, LessonAttempt, UserSkillProgress
from app.models.skill import Exercise, ExerciseOption, Lesson, Skill
from app.models.user import User
from app.services import (
    achievement_service,
    answer_checker,
    gem_service,
    hearts_service,
    quest_service,
    streak_service,
    unlock_service,
    xp_service,
)


@dataclass
class SanitizedOption:
    id: int
    text: str
    emoji: Optional[str] = None
    side: Optional[str] = None


@dataclass
class SanitizedExercise:
    id: int
    type: str
    instruction: str
    prompt_text: Optional[str]
    prompt_language: Optional[str]
    target_language: Optional[str]
    sentence_with_blank: Optional[str]
    audio_text: Optional[str]
    emoji: Optional[str]
    options: list[SanitizedOption]


def sanitize_exercise(ex: Exercise) -> SanitizedExercise:
    """Strip secret answers from exercise payload before sending to client."""
    sanitized_options: list[SanitizedOption] = []
    
    # Shuffle options for choice and word-bank exercises
    options_list = list(ex.options)
    if ex.type in ("multiple_choice", "fill_in_blank", "translate_word_bank", "listen_tap"):
        random.seed(ex.id)  # Deterministic shuffle per exercise
        random.shuffle(options_list)

    for opt in options_list:
        sanitized_options.append(
            SanitizedOption(
                id=opt.id,
                text=opt.text,
                emoji=opt.emoji,
                side=opt.side,
            )
        )

    return SanitizedExercise(
        id=ex.id,
        type=ex.type,
        instruction=ex.instruction,
        prompt_text=ex.prompt_text,
        prompt_language=ex.prompt_language,
        target_language=ex.target_language,
        sentence_with_blank=ex.sentence_with_blank,
        audio_text=ex.audio_text,
        emoji=ex.emoji,
        options=sanitized_options,
    )


def start_lesson_attempt(db: Session, user: User, lesson_id: int) -> tuple[LessonAttempt, list[SanitizedExercise]]:
    """Start a standard progression lesson."""
    lesson = db.scalar(
        select(Lesson)
        .options(selectinload(Lesson.skill), selectinload(Lesson.exercises).selectinload(Exercise.options))
        .where(Lesson.id == lesson_id)
    )
    if lesson is None:
        raise NotFoundError("Lesson")

    skill = lesson.skill
    if skill is None or skill.kind != "skill":
        raise AppError("INVALID_SKILL", "This is not a regular lesson skill.", 400)

    # Check unlock status
    states = unlock_service.states_for_user(db, user.id)
    skill_state = states.get(skill.id)
    if not skill_state or skill_state.state == unlock_service.LOCKED:
        raise LockedError("This skill is locked. Complete previous skills first!")

    # Check hearts
    hearts_service.apply_regen(db, user)
    if user.hearts <= 0:
        raise OutOfHeartsError()

    exercises = sorted(lesson.exercises, key=lambda e: e.order_index)
    if not exercises:
        raise AppError("NO_EXERCISES", "This lesson contains no exercises.", 400)

    queue = [e.id for e in exercises]

    attempt = LessonAttempt(
        user_id=user.id,
        lesson_id=lesson.id,
        skill_id=skill.id,
        kind="lesson",
        status="in_progress",
        started_at=clock.now(user),
        total_exercises=len(exercises),
        correct_count=0,
        mistakes=0,
        hearts_lost=0,
        queue_json=queue,
        meta_json={"initial_exercise_ids": queue},
    )
    db.add(attempt)
    db.flush()

    sanitized = [sanitize_exercise(e) for e in exercises]
    return attempt, sanitized


def start_practice_attempt(
    db: Session,
    user: User,
    kind: str,
    skill_id: Optional[int] = None,
) -> tuple[LessonAttempt, list[SanitizedExercise]]:
    """
    Start a practice session:
      - 'hearts_practice': earn +1 heart upon completion
      - 'personalized': practice past mistakes
      - 'timed': 60-second speed test
      - 'legendary': challenge on a completed skill
      - 'unit_review': end of unit review
    """
    if kind not in ("hearts_practice", "personalized", "timed", "legendary", "unit_review"):
        raise AppError("INVALID_PRACTICE_KIND", f"Unknown practice kind '{kind}'.", 400)

    exercises: list[Exercise] = []
    target_skill: Optional[Skill] = None

    if kind == "legendary":
        if skill_id is None:
            raise AppError("SKILL_REQUIRED", "Legendary challenge requires a skill_id.", 400)
        target_skill = db.get(Skill, skill_id)
        if target_skill is None:
            raise NotFoundError("Skill")
        states = unlock_service.states_for_user(db, user.id)
        skill_state = states.get(skill_id)
        if not skill_state or skill_state.state not in (unlock_service.COMPLETED, unlock_service.LEGENDARY):
            raise AppError("SKILL_NOT_COMPLETED", "Only completed skills can be played in Legendary mode.", 400)

        # Gather up to 15 exercises from this skill
        stmt = (
            select(Exercise)
            .join(Lesson)
            .where(Lesson.skill_id == skill_id)
            .options(selectinload(Exercise.options))
        )
        exercises = list(db.scalars(stmt))
        random.shuffle(exercises)
        exercises = exercises[:15]

    elif kind in ("hearts_practice", "timed", "personalized"):
        # Select exercises from any unlocked or completed skills
        stmt = (
            select(Exercise)
            .join(Lesson)
            .join(Skill)
            .options(selectinload(Exercise.options))
            .limit(10)
        )
        exercises = list(db.scalars(stmt))
        random.shuffle(exercises)
        exercises = exercises[:10]

    elif kind == "unit_review":
        if skill_id is not None:
            target_skill = db.get(Skill, skill_id)
            unit_id = target_skill.unit_id if target_skill else None
            stmt = (
                select(Exercise)
                .join(Lesson)
                .join(Skill)
                .where(Skill.unit_id == unit_id)
                .options(selectinload(Exercise.options))
                .limit(10)
            )
            exercises = list(db.scalars(stmt))
            random.shuffle(exercises)
        else:
            exercises = list(db.scalars(select(Exercise).limit(10)))

    if not exercises:
        # Fallback to any exercises available
        exercises = list(db.scalars(select(Exercise).options(selectinload(Exercise.options)).limit(8)))

    queue = [e.id for e in exercises]

    attempt = LessonAttempt(
        user_id=user.id,
        lesson_id=None,
        skill_id=target_skill.id if target_skill else None,
        kind=kind,
        status="in_progress",
        started_at=clock.now(user),
        total_exercises=len(exercises),
        correct_count=0,
        mistakes=0,
        hearts_lost=0,
        queue_json=queue,
        meta_json={"initial_exercise_ids": queue},
    )
    db.add(attempt)
    db.flush()

    sanitized = [sanitize_exercise(e) for e in exercises]
    return attempt, sanitized


def submit_answer(
    db: Session,
    user: User,
    attempt_id: int,
    exercise_id: int,
    submitted_answer: dict[str, Any],
    time_ms: int = 0,
) -> dict[str, Any]:
    """
    Check an answer submission, handle mistake re-queuing and heart penalty.
    """
    attempt = db.get(LessonAttempt, attempt_id)
    if attempt is None or attempt.user_id != user.id:
        raise NotFoundError("Attempt")

    if attempt.status != "in_progress":
        raise AppError("ATTEMPT_NOT_ACTIVE", f"Attempt status is '{attempt.status}'.", 409)

    queue = attempt.queue_json or []
    if exercise_id not in queue:
        raise AppError("EXERCISE_NOT_IN_QUEUE", "This exercise is not in the active queue.", 400)

    exercise = db.scalar(
        select(Exercise)
        .options(selectinload(Exercise.options), selectinload(Exercise.accepted_answers))
        .where(Exercise.id == exercise_id)
    )
    if exercise is None:
        raise NotFoundError("Exercise")

    # Build pure checker structures
    ex_data = answer_checker.ExerciseData(
        type=exercise.type,
        correct_answer=exercise.correct_answer,
        accepted_answers=[a.answer_text for a in exercise.accepted_answers],
        options=[
            answer_checker.OptionData(
                id=o.id,
                text=o.text,
                is_correct=o.is_correct,
                correct_position=o.correct_position,
                pair_group=o.pair_group,
                side=o.side,
            )
            for o in exercise.options
        ],
    )

    check_res = answer_checker.check_answer(ex_data, submitted_answer)

    # Record answer in DB
    ans_record = AttemptAnswer(
        attempt_id=attempt.id,
        exercise_id=exercise.id,
        submitted_answer_json=submitted_answer,
        is_correct=check_res.is_correct,
        is_typo=check_res.is_typo,
        time_ms=time_ms,
        answered_at=clock.now(user),
    )
    db.add(ans_record)

    failed = False
    requeued = False

    if check_res.is_correct:
        # Remove from queue
        queue = [qid for qid in queue if qid != exercise_id]
        attempt.correct_count += 1
    else:
        # Mistake!
        attempt.mistakes += 1

        # Re-queue the wrong exercise at the end
        queue = [qid for qid in queue if qid != exercise_id] + [exercise_id]
        requeued = True

        # Normal lessons cost 1 heart on wrong answer
        if attempt.kind == "lesson":
            hearts_service.change_hearts(db, user, -1, "wrong_answer", attempt_id=attempt.id)
            attempt.hearts_lost += 1
            if user.hearts <= 0:
                attempt.status = "failed"
                failed = True

        # Legendary mode fails after 3 mistakes
        elif attempt.kind == "legendary" and attempt.mistakes >= 3:
            attempt.status = "failed"
            failed = True

    attempt.queue_json = queue

    # Prepare response
    canonical_correct = exercise.correct_answer
    if not canonical_correct:
        # Find correct option for choice / blank
        corr_opt = next((o.text for o in exercise.options if o.is_correct), None)
        canonical_correct = corr_opt or ""

    alternatives = [a.answer_text for a in exercise.accepted_answers if a.answer_text != canonical_correct]

    return {
        "is_correct": check_res.is_correct,
        "is_typo": check_res.is_typo,
        "note": check_res.note,
        "correct_answer": canonical_correct,
        "alternatives": alternatives,
        "explanation": exercise.explanation,
        "hearts_remaining": user.hearts,
        "requeued": requeued,
        "failed": failed,
        "progress": {
            "correct": attempt.correct_count,
            "total": attempt.total_exercises,
            "remaining_in_queue": len(queue),
        },
    }


def skip_exercise(db: Session, user: User, attempt_id: int, exercise_id: int) -> dict[str, Any]:
    """Skip counts as an incorrect answer."""
    return submit_answer(
        db, user, attempt_id, exercise_id, submitted_answer={"skipped": True}, time_ms=0
    )


def complete_attempt(db: Session, user: User, attempt_id: int) -> dict[str, Any]:
    """
    Finish an attempt and execute the transactional gamification updates:
      - Award XP
      - Award Gems
      - Update streak
      - Update daily activity & daily goal
      - Update skill progress & unlocks
      - Evaluate achievements
      - Refresh quests
    """
    attempt = db.get(LessonAttempt, attempt_id)
    if attempt is None or attempt.user_id != user.id:
        raise NotFoundError("Attempt")

    if attempt.status == "completed":
        raise AlreadyCompletedError("This lesson attempt")

    if attempt.status != "in_progress":
        raise AppError("ATTEMPT_NOT_COMPATIBLE", f"Cannot complete an attempt with status '{attempt.status}'.", 400)

    queue = attempt.queue_json or []
    if queue and attempt.kind != "timed":
        raise AppError("QUEUE_NOT_EMPTY", "Cannot complete lesson: remaining exercises to finish.", 400)

    now = clock.now(user)
    duration_sec = int((now - clock.as_aware(attempt.started_at)).total_seconds())
    attempt.completed_at = now
    attempt.duration_seconds = max(1, duration_sec)
    attempt.status = "completed"
    attempt.is_perfect = attempt.mistakes == 0

    # 1. Compute and award XP
    timed_score = attempt.correct_count if attempt.kind == "timed" else 0
    lesson_base_xp = 10
    if attempt.lesson_id:
        lesson = db.get(Lesson, attempt.lesson_id)
        if lesson:
            lesson_base_xp = lesson.xp_reward

    xp_breakdown = xp_service.compute_xp(
        kind=attempt.kind,
        mistakes=attempt.mistakes,
        lesson_xp=lesson_base_xp,
        timed_score=timed_score,
    )
    attempt.xp_earned = xp_breakdown.total
    xp_service.award_xp(
        db, user, xp_breakdown.total, xp_service.xp_source_for(attempt.kind), attempt_id=attempt.id
    )

    # 2. Daily activity & Daily goal
    goal_res = xp_service.record_activity(
        db, user, xp_breakdown.total, completed_session=(attempt.kind == "lesson")
    )

    # 3. Streak calculation
    streak_res = streak_service.compute_streak_update(
        current=user.current_streak,
        longest=user.longest_streak,
        last_activity=user.last_activity_date,
        today=clock.today(user),
        freezes=user.streak_freezes,
    )
    user.current_streak = streak_res.after
    user.longest_streak = streak_res.longest
    user.last_activity_date = clock.today(user)
    if streak_res.freeze_used_on:
        user.streak_freezes = max(0, user.streak_freezes - 1)
        missed_act = xp_service.get_or_create_activity(db, user.id, streak_res.freeze_used_on)
        missed_act.streak_freeze_used = True

    # 4. Gems & Practice bonuses
    gems_awarded = 0
    if attempt.is_perfect and attempt.kind == "lesson":
        gems_awarded += 2
        gem_service.change_gems(db, user, 2, "lesson", ref_id=attempt.id)
    attempt.gems_earned = gems_awarded

    if attempt.kind == "hearts_practice":
        hearts_service.change_hearts(db, user, +1, "practice", attempt_id=attempt.id)

    # 5. Skill progression
    skill_info = None
    if attempt.skill_id:
        skill = db.get(Skill, attempt.skill_id)
        if skill:
            prog = unlock_service.get_or_create_progress(db, user.id, skill.id)
            if attempt.kind == "lesson" and attempt.lesson_id:
                les = db.get(Lesson, attempt.lesson_id)
                if les and les.level_number == prog.lessons_completed + 1:
                    prog.lessons_completed += 1
                    if prog.lessons_completed >= skill.total_levels:
                        prog.completed_at = now

            elif attempt.kind == "legendary":
                prog.is_legendary = True

            prog.last_practiced_at = now

            course = unlock_service.load_course(db)
            next_sid = unlock_service.next_skill_id(course, skill.id)
            skill_info = {
                "id": skill.id,
                "title": skill.title,
                "lessons_completed": prog.lessons_completed,
                "total_levels": skill.total_levels,
                "skill_completed": prog.lessons_completed >= skill.total_levels,
                "is_legendary": prog.is_legendary,
                "next_skill_id": next_sid,
            }

    # 6. Achievements evaluation
    unlocked_achievements = achievement_service.evaluate(db, user)

    # 7. Quests refresh
    _, newly_completed_quests = quest_service.refresh(db, user)

    accuracy = (
        round(attempt.correct_count / (attempt.correct_count + attempt.mistakes), 2)
        if (attempt.correct_count + attempt.mistakes) > 0
        else 1.0
    )

    db.flush()

    return {
        "xp": {
            "base": xp_breakdown.base,
            "perfect_bonus": xp_breakdown.perfect_bonus,
            "total": xp_breakdown.total,
        },
        "gems": gems_awarded,
        "accuracy": accuracy,
        "duration_seconds": attempt.duration_seconds,
        "is_perfect": attempt.is_perfect,
        "streak": {
            "before": streak_res.before,
            "after": streak_res.after,
            "extended": streak_res.extended,
            "milestone": streak_res.milestone,
        },
        "daily_goal": {
            "goal": goal_res.goal,
            "today_xp": goal_res.today_xp,
            "just_reached": goal_res.just_reached,
        },
        "skill": skill_info,
        "achievements_unlocked": [
            {"key": a.key, "tier": a.tier, "title": a.title, "reward_gems": a.reward_gems}
            for a in unlocked_achievements
        ],
        "quests_completed": [{"id": q.id, "title": q.title} for q in newly_completed_quests],
    }


def abandon_attempt(db: Session, user: User, attempt_id: int) -> dict[str, str]:
    """Abandon an active attempt. Hearts already lost remain lost."""
    attempt = db.get(LessonAttempt, attempt_id)
    if attempt is None or attempt.user_id != user.id:
        raise NotFoundError("Attempt")

    if attempt.status == "in_progress":
        attempt.status = "abandoned"
        attempt.completed_at = clock.now(user)

    return {"status": "abandoned"}
