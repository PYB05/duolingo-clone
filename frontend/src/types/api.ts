/**
 * TypeScript API interfaces mirroring FastAPI Pydantic models.
 */

export interface UserSettings {
  sound_effects: boolean;
  animations: boolean;
  theme: 'system' | 'light' | 'dark';
  listening_exercises: boolean;
  debug_day_offset: number;
}

export interface UserMe {
  id: number;
  username: string;
  display_name: string;
  avatar_color: string;
  total_xp: number;
  gems: number;
  hearts: number;
  next_heart_in_seconds: number | null;
  current_streak: number;
  displayed_streak: number;
  longest_streak: number;
  is_streak_extended_today: boolean;
  today_xp: number;
  daily_goal_xp: number;
  streak_freezes: number;
  league_tier: number;
  settings: UserSettings;
  simulated_today: string;
}

export interface SkillSummary {
  id: number;
  order_index: number;
  kind: 'skill' | 'chest' | 'unit_review';
  title: string;
  icon_key: string | null;
  total_levels: number;
  lessons_completed: number;
  state: 'locked' | 'available' | 'in_progress' | 'completed' | 'legendary';
  is_current: boolean;
  is_legendary: boolean;
  chest_opened: boolean;
}

export interface UnitSummary {
  id: number;
  order_index: number;
  title: string;
  description: string | null;
  theme_color: string;
  theme_shadow_color: string;
  has_guidebook: boolean;
  skills: SkillSummary[];
}

export interface SectionSummary {
  id: number;
  order_index: number;
  title: string;
  description: string | null;
  units: UnitSummary[];
}

export interface Course {
  id: number;
  title: string;
  learning_language_code: string;
  from_language_code: string;
  flag_emoji: string;
  description: string | null;
  sections: SectionSummary[];
}

export interface Guidebook {
  unit_id: number;
  title: string;
  guidebook_md: string | null;
}

export interface SanitizedOption {
  id: number;
  text: string;
  emoji?: string | null;
  side?: 'left' | 'right' | null;
}

export interface SanitizedExercise {
  id: number;
  type:
    | 'multiple_choice'
    | 'translate_word_bank'
    | 'match_pairs'
    | 'fill_in_blank'
    | 'type_answer'
    | 'listen_tap'
    | 'listen_type'
    | 'speak';
  instruction: string;
  prompt_text: string | null;
  prompt_language: string | null;
  target_language: string | null;
  sentence_with_blank: string | null;
  audio_text: string | null;
  emoji: string | null;
  options: SanitizedOption[];
}

export interface StartLessonResponse {
  attempt_id: number;
  kind: string;
  hearts: number;
  total_exercises: number;
  exercises: SanitizedExercise[];
}

export interface SubmitAnswerResponse {
  is_correct: boolean;
  is_typo: boolean;
  note: string | null;
  correct_answer: string;
  alternatives: string[];
  explanation: string | null;
  hearts_remaining: number;
  requeued: boolean;
  failed: boolean;
  progress: {
    correct: number;
    total: number;
    remaining_in_queue: number;
  };
}

export interface CompleteAttemptResponse {
  xp: {
    base: number;
    perfect_bonus: number;
    total: number;
  };
  gems: number;
  accuracy: number;
  duration_seconds: number;
  is_perfect: boolean;
  streak: {
    before: number;
    after: number;
    extended: boolean;
    milestone: boolean;
  };
  daily_goal: {
    goal: number;
    today_xp: number;
    just_reached: boolean;
  };
  skill: {
    id: number;
    title: string;
    lessons_completed: number;
    total_levels: number;
    skill_completed: boolean;
    is_legendary: boolean;
    next_skill_id: number | null;
  } | null;
  achievements_unlocked: Array<{
    key: string;
    tier: number;
    title: string;
    reward_gems: number;
  }>;
  quests_completed: Array<{
    id: number;
    title: string;
  }>;
}

export interface StandingUser {
  id: number;
  display_name: string;
  avatar_color: string;
  is_current_user: boolean;
}

export interface Standing {
  rank: number;
  user: StandingUser;
  weekly_xp: number;
}

export interface LeaderboardResponse {
  tier: number;
  tier_name: string;
  tier_color: string;
  week_ends_at: string;
  promotion_zone: number;
  demotion_zone: number;
  user_rank: number;
  user_weekly_xp: number;
  standings: Standing[];
  last_week_result: {
    tier: number;
    final_rank: number;
    result: string;
  } | null;
}

export interface QuestItem {
  id: number;
  key: string;
  title: string;
  metric: string;
  target: number;
  progress: number;
  reward_gems: number;
  period: 'daily' | 'monthly';
  is_completed: boolean;
  is_claimed: boolean;
}

export interface QuestsResponse {
  daily_quests: QuestItem[];
  monthly_quests: QuestItem[];
}

export interface ShopItem {
  id: number;
  key: string;
  name: string;
  description: string;
  price_gems: number;
  max_owned: number | null;
  owned_count: number | null;
}

export interface ShopResponse {
  gems: number;
  items: ShopItem[];
}

export interface AchievementTier {
  tier_number: number;
  threshold: number;
  reward_gems: number;
  is_unlocked: boolean;
}

export interface AchievementItem {
  id: number;
  key: string;
  title: string;
  description: string;
  icon_key: string;
  color_hex: string;
  current_value: number;
  current_tier: number;
  max_tier: number;
  next_threshold: number | null;
  tiers: AchievementTier[];
}

export interface ProfileResponse {
  username: string;
  display_name: string;
  avatar_color: string;
  joined_date: string;
  day_streak: number;
  total_xp: number;
  current_league: string;
  top_3_finishes: number;
  weekly_xp_chart: Array<{
    date: string;
    day_name: string;
    xp: number;
  }>;
  active_days: string[];
  achievements_summary: any[];
}
