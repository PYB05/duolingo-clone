"""
Seed script — populates the database with initial curriculum, bots, quests,
achievements, shop items, and the default demo learner.

Usage:
    python -m app.seed.seed [--reset]
"""

import sys
from datetime import timedelta

from sqlalchemy import select

from app.core import clock
from app.core.database import SessionLocal, create_tables, engine
from app.models import (
    AchievementDefinition,
    AchievementTier,
    Base,
    Course,
    DailyActivity,
    Enrollment,
    Exercise,
    ExerciseAcceptedAnswer,
    ExerciseOption,
    LeagueGroup,
    LeagueMembership,
    LeagueTier,
    Lesson,
    QuestDefinition,
    Section,
    ShopItem,
    Skill,
    Unit,
    User,
    UserSettings,
    UserSkillProgress,
    XPEvent,
)
from app.seed.content.spanish import get_spanish_course


def _is_empty(db) -> bool:
    count = db.scalar(select(Course).limit(1))
    return count is None


def _reset() -> None:
    Base.metadata.drop_all(bind=engine)
    create_tables()
    print("[seed] Database reset — all tables dropped and recreated.")


def _seed(db) -> None:
    # -------------------------------------------------------------------------
    # 1. Course content
    # -------------------------------------------------------------------------
    course_data = get_spanish_course()
    c = course_data["course"]
    course = Course(
        title=c["title"],
        learning_language_code=c["learning_language_code"],
        from_language_code=c["from_language_code"],
        flag_emoji=c["flag_emoji"],
        description=c["description"],
    )
    db.add(course)
    db.flush()

    for sec_data in course_data["sections"]:
        section = Section(
            course_id=course.id,
            order_index=sec_data["order_index"],
            title=sec_data["title"],
            description=sec_data["description"],
        )
        db.add(section)
        db.flush()

        for unit_data in sec_data["units"]:
            unit = Unit(
                section_id=section.id,
                order_index=unit_data["order_index"],
                title=unit_data["title"],
                description=unit_data["description"],
                theme_color=unit_data["theme_color"],
                theme_shadow_color=unit_data["theme_shadow_color"],
                guidebook_md=unit_data["guidebook_md"],
            )
            db.add(unit)
            db.flush()

            for skill_data in unit_data["skills"]:
                skill = Skill(
                    unit_id=unit.id,
                    order_index=skill_data["order_index"],
                    kind=skill_data["kind"],
                    title=skill_data["title"],
                    icon_key=skill_data.get("icon_key"),
                    total_levels=skill_data["total_levels"],
                )
                db.add(skill)
                db.flush()

                for les_data in skill_data.get("lessons", []):
                    lesson = Lesson(
                        skill_id=skill.id,
                        level_number=les_data["level_number"],
                        xp_reward=les_data["xp_reward"],
                    )
                    db.add(lesson)
                    db.flush()

                    for ex_data in les_data.get("exercises", []):
                        ex = Exercise(
                            lesson_id=lesson.id,
                            order_index=ex_data["order_index"],
                            type=ex_data["type"],
                            instruction=ex_data["instruction"],
                            prompt_text=ex_data.get("prompt_text"),
                            prompt_language=ex_data.get("prompt_language"),
                            target_language=ex_data.get("target_language"),
                            sentence_with_blank=ex_data.get("sentence_with_blank"),
                            correct_answer=ex_data.get("correct_answer"),
                            audio_text=ex_data.get("audio_text"),
                            emoji=ex_data.get("emoji"),
                            difficulty=ex_data.get("difficulty", 1),
                        )
                        db.add(ex)
                        db.flush()

                        for opt_data in ex_data.get("options", []):
                            op = ExerciseOption(
                                exercise_id=ex.id,
                                order_index=opt_data.get("correct_position", 0) or 0,
                                text=opt_data["text"],
                                emoji=opt_data.get("emoji"),
                                is_correct=opt_data.get("is_correct", False),
                                correct_position=opt_data.get("correct_position"),
                                pair_group=opt_data.get("pair_group"),
                                side=opt_data.get("side"),
                            )
                            db.add(op)

                        for ans_text in ex_data.get("accepted_answers", []):
                            ans = ExerciseAcceptedAnswer(
                                exercise_id=ex.id,
                                answer_text=ans_text,
                            )
                            db.add(ans)

    # -------------------------------------------------------------------------
    # 2. League Tiers
    # -------------------------------------------------------------------------
    tiers = [
        (1, "Bronze", "#CD7F32"),
        (2, "Silver", "#C0C0C0"),
        (3, "Gold", "#FFD700"),
        (4, "Sapphire", "#0F52BA"),
        (5, "Ruby", "#E0115F"),
        (6, "Emerald", "#50C878"),
        (7, "Amethyst", "#9966CC"),
        (8, "Pearl", "#EAE0C8"),
        (9, "Obsidian", "#302E2E"),
        (10, "Diamond", "#B9F2FF"),
    ]
    for tier, name, color in tiers:
        db.add(LeagueTier(tier=tier, name=name, color_hex=color))

    # -------------------------------------------------------------------------
    # 3. Shop Items
    # -------------------------------------------------------------------------
    db.add_all(
        [
            ShopItem(
                key="heart_refill",
                name="Refill Hearts",
                description="Get full hearts so you can worry less about mistakes in lessons.",
                price_gems=350,
                is_available=True,
            ),
            ShopItem(
                key="streak_freeze",
                name="Streak Freeze",
                description="Streak Freeze allows your streak to remain in place for one full day of inactivity.",
                price_gems=200,
                max_owned=2,
                is_available=True,
            ),
        ]
    )

    # -------------------------------------------------------------------------
    # 4. Quest Definitions
    # -------------------------------------------------------------------------
    db.add_all(
        [
            QuestDefinition(
                key="earn_30_xp_daily",
                title="Earn 30 XP",
                metric="xp",
                target=30,
                reward_gems=10,
                period="daily",
            ),
            QuestDefinition(
                key="complete_3_lessons_daily",
                title="Complete 3 lessons",
                metric="lessons",
                target=3,
                reward_gems=15,
                period="daily",
            ),
            QuestDefinition(
                key="perfect_lesson_daily",
                title="Complete 1 perfect lesson",
                metric="perfect_lessons",
                target=1,
                reward_gems=20,
                period="daily",
            ),
            QuestDefinition(
                key="monthly_500_xp",
                title="Monthly Challenge: Earn 500 XP",
                metric="xp",
                target=500,
                reward_gems=100,
                period="monthly",
            ),
        ]
    )

    # -------------------------------------------------------------------------
    # 5. Achievements
    # -------------------------------------------------------------------------
    achievements_data = [
        ("wildfire", "Wildfire", "Reach a streak milestone.", "streak", "flame", "#FF9600", [3, 7, 14, 30, 60, 100]),
        ("sage", "Sage", "Earn total XP milestones.", "total_xp", "bolt", "#FFC800", [100, 250, 500, 1000, 2500]),
        ("scholar", "Scholar", "Complete unique skills.", "skills_completed", "star", "#58CC02", [1, 3, 6, 12]),
        ("sharpshooter", "Sharpshooter", "Complete lessons with no mistakes.", "perfect_lessons", "target", "#1CB0F6", [1, 5, 10, 25]),
        ("champion", "Champion", "Get promoted to higher leagues.", "promotions", "trophy", "#CE82FF", [1, 3, 5]),
        ("legendary", "Legendary", "Complete Legendary challenges.", "legendary", "crown", "#A568CC", [1, 3, 5]),
        ("early_bird", "Early Bird", "Complete lessons before 8 AM.", "early_lessons", "sun", "#FF9600", [1, 5, 15]),
        ("night_owl", "Night Owl", "Complete lessons after 10 PM.", "late_lessons", "moon", "#0F52BA", [1, 5, 15]),
        ("overachiever", "Overachiever", "Double your daily goal in a day.", "double_goal_days", "fire", "#FF4B4B", [1, 5, 10]),
    ]
    for key, title, desc, metric, icon, color, thresholds in achievements_data:
        ach = AchievementDefinition(
            key=key, title=title, description=desc, metric=metric, icon_key=icon, color_hex=color
        )
        db.add(ach)
        db.flush()
        for tier_num, thresh in enumerate(thresholds, 1):
            db.add(
                AchievementTier(
                    achievement_id=ach.id,
                    tier_number=tier_num,
                    threshold=thresh,
                    reward_gems=thresh * 5,
                )
            )

    # -------------------------------------------------------------------------
    # 6. Bots (29 seeded learners for competitive leagues)
    # -------------------------------------------------------------------------
    bot_names = [
        ("Elena Gomez", "#1CB0F6", 35),
        ("Marco Rossi", "#58CC02", 45),
        ("Aoi Tanaka", "#CE82FF", 60),
        ("Liam O'Connor", "#FF9600", 25),
        ("Zara Chen", "#FF4B4B", 70),
        ("Mateo Silva", "#FFC800", 30),
        ("Chloe Martin", "#1CB0F6", 50),
        ("Siddharth Patel", "#58CC02", 40),
        ("Amira Hassan", "#CE82FF", 55),
        ("Noah Becker", "#FF9600", 20),
        ("Sofia Rodriguez", "#FF4B4B", 65),
        ("Lucas Dubois", "#FFC800", 35),
        ("Mia Johansson", "#1CB0F6", 45),
        ("Alexander Smith", "#58CC02", 30),
        ("Freja Nielsen", "#CE82FF", 50),
        ("Gabriel Santos", "#FF9600", 40),
        ("Ananya Sharma", "#FF4B4B", 60),
        ("Daniel Kim", "#FFC800", 25),
        ("Isabella Rossi", "#1CB0F6", 55),
        ("Lukas Weber", "#58CC02", 35),
        ("Yuki Takahashi", "#CE82FF", 45),
        ("Olivia Brown", "#FF9600", 50),
        ("Benjamin Garcia", "#FF4B4B", 30),
        ("Zoe Lefebvre", "#FFC800", 65),
        ("Arthur Pendelton", "#1CB0F6", 20),
        ("Valentina Perez", "#58CC02", 40),
        ("Hiroshi Sato", "#CE82FF", 35),
        ("Fatima Al-Mansoor", "#FF9600", 50),
        ("David Miller", "#FF4B4B", 45),
    ]

    bots: list[User] = []
    for i, (name, color, xp_rate) in enumerate(bot_names, 1):
        bot = User(
            username=f"bot_{i}",
            display_name=name,
            avatar_color=color,
            is_bot=True,
            bot_xp_per_day=xp_rate,
            joined_at=clock.utc_now() - timedelta(days=60),
            hearts_updated_at=clock.utc_now(),
        )
        db.add(bot)
        bots.append(bot)
    db.flush()

    # -------------------------------------------------------------------------
    # 7. Default Demo Learner (`learner`)
    # -------------------------------------------------------------------------
    t_date = clock.today()
    learner = User(
        username="learner",
        display_name="Demo Learner",
        avatar_color="#58CC02",
        joined_at=clock.utc_now() - timedelta(days=14),
        total_xp=340,
        gems=500,
        hearts=4,
        hearts_updated_at=clock.utc_now() - timedelta(hours=1),
        current_streak=7,
        longest_streak=7,
        last_activity_date=t_date - timedelta(days=1),  # Yesterday: ready to extend streak today!
        streak_freezes=1,
        daily_goal_xp=20,
        league_tier=1,
    )
    db.add(learner)
    db.flush()

    # Settings & Enrollment
    db.add(UserSettings(user_id=learner.id))
    db.add(
        Enrollment(
            user_id=learner.id,
            course_id=course.id,
            started_at=learner.joined_at,
            is_active=True,
        )
    )

    # Unit 1 Skills Progress:
    # Skill 1 (Basics 1): Completed (3/3)
    # Skill 2 (Greetings): Completed (3/3)
    # Skill 3 (Introductions): In Progress (2/3) - current active skill!
    unit_1_skills = (
        db.scalars(
            select(Skill)
            .join(Unit)
            .where(Unit.order_index == 1, Skill.kind == "skill")
            .order_by(Skill.order_index)
        )
        .all()
    )

    if len(unit_1_skills) >= 3:
        s1, s2, s3 = unit_1_skills[0], unit_1_skills[1], unit_1_skills[2]
        db.add_all(
            [
                UserSkillProgress(
                    user_id=learner.id,
                    skill_id=s1.id,
                    lessons_completed=s1.total_levels,
                    completed_at=clock.utc_now() - timedelta(days=3),
                ),
                UserSkillProgress(
                    user_id=learner.id,
                    skill_id=s2.id,
                    lessons_completed=s2.total_levels,
                    completed_at=clock.utc_now() - timedelta(days=1),
                ),
                UserSkillProgress(
                    user_id=learner.id,
                    skill_id=s3.id,
                    lessons_completed=2,  # 2 of 3 levels completed
                ),
            ]
        )

    # 7 days of past daily activity to back the 7-day streak
    for days_ago in range(1, 8):
        act_date = t_date - timedelta(days=days_ago)
        db.add(
            DailyActivity(
                user_id=learner.id,
                activity_date=act_date,
                xp_earned=30,
                lessons_completed=2,
                goal_met=True,
            )
        )
        db.add(
            XPEvent(
                user_id=learner.id,
                amount=30,
                source="lesson",
                activity_date=act_date,
                created_at=clock.utc_now() - timedelta(days=days_ago),
            )
        )

    # Create this week's league group with the learner and bots
    w_start = clock.week_start(t_date)
    league_group = LeagueGroup(
        week_start=w_start,
        tier=1,
        created_at=clock.utc_now() - timedelta(days=3),
    )
    db.add(league_group)
    db.flush()

    # Learner joins league
    db.add(
        LeagueMembership(
            group_id=league_group.id,
            user_id=learner.id,
            weekly_xp=60,
            result="pending",
        )
    )

    # Bots join league
    for bot in bots:
        db.add(
            LeagueMembership(
                group_id=league_group.id,
                user_id=bot.id,
                weekly_xp=0,
                result="pending",
            )
        )


def run_seed(force_reset: bool = False) -> None:
    if force_reset:
        _reset()
    create_tables()

    db = SessionLocal()
    try:
        if _is_empty(db):
            _seed(db)
            db.commit()
            print("[seed] Database seeded successfully.")
        else:
            print("[seed] Database already seeded — skipping.")
    except Exception as e:
        db.rollback()
        print(f"[seed] Error seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    force = "--reset" in sys.argv
    run_seed(force_reset=force)
