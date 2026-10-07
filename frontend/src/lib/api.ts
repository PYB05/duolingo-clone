/**
 * Typed API client for FastAPI backend.
 */

import {
  Course,
  Guidebook,
  LeaderboardResponse,
  ProfileResponse,
  QuestsResponse,
  ShopResponse,
  StartLessonResponse,
  SubmitAnswerResponse,
  CompleteAttemptResponse,
  UserMe,
  UserSettings,
} from '@/types/api';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' ? '/api/v1' : 'http://127.0.0.1:8000/api/v1');

export class ApiError extends Error {
  code: string;
  status: number;
  details?: Record<string, any>;

  constructor(message: string, code = 'ERROR', status = 500, details?: Record<string, any>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err = data.error || {};
      throw new ApiError(
        err.message || `Request failed with status ${res.status}`,
        err.code || 'UNKNOWN_ERROR',
        res.status,
        err.details
      );
    }

    return data as T;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message || 'Network request failed', 'NETWORK_ERROR', 0);
  }
}

export const api = {
  // User & Settings
  getMe: () => request<UserMe>('/me'),
  updateMe: (data: { display_name?: string; daily_goal_xp?: number }) =>
    request<UserMe>('/me', { method: 'PATCH', body: JSON.stringify(data) }),
  getSettings: () => request<UserSettings>('/me/settings'),
  updateSettings: (data: Partial<UserSettings>) =>
    request<UserSettings>('/me/settings', { method: 'PATCH', body: JSON.stringify(data) }),

  // Course
  getCourse: () => request<Course>('/course'),
  getGuidebook: (unitId: number) => request<Guidebook>(`/units/${unitId}/guide`),
  openChest: (skillId: number) =>
    request<{ gems_awarded: number; total_gems: number }>(`/chests/${skillId}/open`, {
      method: 'POST',
    }),

  // Lessons & Attempts
  startLesson: (lessonId: number) =>
    request<StartLessonResponse>(`/lessons/${lessonId}/start`, { method: 'POST' }),
  submitAnswer: (attemptId: number, exerciseId: number, answer: any, timeMs = 0) =>
    request<SubmitAnswerResponse>(`/attempts/${attemptId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ exercise_id: exerciseId, answer, time_ms: timeMs }),
    }),
  skipExercise: (attemptId: number, exerciseId: number) =>
    request<SubmitAnswerResponse>(`/attempts/${attemptId}/skip?exercise_id=${exerciseId}`, {
      method: 'POST',
    }),
  completeAttempt: (attemptId: number) =>
    request<CompleteAttemptResponse>(`/attempts/${attemptId}/complete`, { method: 'POST' }),
  abandonAttempt: (attemptId: number) =>
    request<{ status: string }>(`/attempts/${attemptId}/abandon`, { method: 'POST' }),

  // Practice
  startPractice: (kind: string, skillId?: number) =>
    request<StartLessonResponse>('/practice/start', {
      method: 'POST',
      body: JSON.stringify({ kind, skill_id: skillId }),
    }),

  // Meta
  getLeaderboard: () => request<LeaderboardResponse>('/leaderboard'),
  getQuests: () => request<QuestsResponse>('/quests'),
  claimQuest: (questId: number) => request<any>(`/quests/${questId}/claim`, { method: 'POST' }),
  getAchievements: () => request<any>('/achievements'),
  getShop: () => request<ShopResponse>('/shop'),
  purchaseItem: (key: string) => request<any>(`/shop/${key}/purchase`, { method: 'POST' }),
  getProfile: () => request<ProfileResponse>('/profile'),

  // Dev
  devTimeTravel: (days: number) =>
    request<any>('/dev/time-travel', { method: 'POST', body: JSON.stringify({ days }) }),
  devSetHearts: (hearts: number) =>
    request<any>('/dev/set-hearts', { method: 'POST', body: JSON.stringify({ hearts }) }),
  devAddXp: (amount: number) =>
    request<any>('/dev/add-xp', { method: 'POST', body: JSON.stringify({ amount }) }),
  devAddGems: (amount: number) =>
    request<any>('/dev/add-gems', { method: 'POST', body: JSON.stringify({ amount }) }),
  devUnlockAll: () => request<any>('/dev/unlock-all', { method: 'POST' }),
  devReset: () => request<any>('/dev/reset', { method: 'POST' }),
};
