import { create } from 'zustand';
import { SanitizedExercise, SubmitAnswerResponse, CompleteAttemptResponse } from '@/types/api';
import { api } from '@/lib/api';
import { sfx } from '@/lib/sfx';

export type LessonStatus = 'answering' | 'feedback' | 'complete' | 'failed';

interface LessonState {
  attemptId: number | null;
  kind: string;
  hearts: number;
  exercises: SanitizedExercise[];
  queue: number[]; // remaining exercise ids
  currentExercise: SanitizedExercise | null;
  draftAnswer: any;
  status: LessonStatus;
  lastFeedback: SubmitAnswerResponse | null;
  completionData: CompleteAttemptResponse | null;
  totalExercises: number;
  correctCount: number;
  mistakesCount: number;
  startTime: number;

  // Actions
  initLesson: (attemptId: number, kind: string, hearts: number, exercises: SanitizedExercise[]) => void;
  setDraftAnswer: (answer: any) => void;
  checkAnswer: () => Promise<void>;
  skipExercise: () => Promise<void>;
  nextExercise: () => Promise<void>;
  reset: () => void;
}

export const useLessonStore = create<LessonState>((set, get) => ({
  attemptId: null,
  kind: 'lesson',
  hearts: 5,
  exercises: [],
  queue: [],
  currentExercise: null,
  draftAnswer: null,
  status: 'answering',
  lastFeedback: null,
  completionData: null,
  totalExercises: 0,
  correctCount: 0,
  mistakesCount: 0,
  startTime: Date.now(),

  initLesson: (attemptId, kind, hearts, exercises) => {
    const queue = exercises.map((e) => e.id);
    set({
      attemptId,
      kind,
      hearts,
      exercises,
      queue,
      currentExercise: exercises[0] || null,
      draftAnswer: null,
      status: 'answering',
      lastFeedback: null,
      completionData: null,
      totalExercises: exercises.length,
      correctCount: 0,
      mistakesCount: 0,
      startTime: Date.now(),
    });
  },

  setDraftAnswer: (draftAnswer) => set({ draftAnswer }),

  checkAnswer: async () => {
    const { attemptId, currentExercise, draftAnswer, startTime } = get();
    if (!attemptId || !currentExercise || !draftAnswer) return;

    const timeMs = Date.now() - startTime;
    try {
      const res = await api.submitAnswer(attemptId, currentExercise.id, draftAnswer, timeMs);

      if (res.is_correct) {
        sfx.play('correct');
      } else {
        sfx.play('wrong');
        if (res.hearts_remaining < get().hearts) {
          sfx.play('heart_lost');
        }
      }

      set((state) => ({
        hearts: res.hearts_remaining,
        lastFeedback: res,
        status: res.failed ? 'failed' : 'feedback',
        correctCount: res.progress.correct,
        mistakesCount: res.is_correct ? state.mistakesCount : state.mistakesCount + 1,
      }));
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  },

  skipExercise: async () => {
    const { attemptId, currentExercise } = get();
    if (!attemptId || !currentExercise) return;

    try {
      const res = await api.skipExercise(attemptId, currentExercise.id);
      sfx.play('wrong');
      sfx.play('heart_lost');

      set((state) => ({
        hearts: res.hearts_remaining,
        lastFeedback: res,
        status: res.failed ? 'failed' : 'feedback',
        mistakesCount: state.mistakesCount + 1,
      }));
    } catch (err) {
      console.error('Failed to skip exercise:', err);
    }
  },

  nextExercise: async () => {
    const { attemptId, queue, exercises, lastFeedback } = get();
    if (!attemptId) return;

    let updatedQueue = [...queue];

    // If last answer was correct, remove current exercise from queue
    if (lastFeedback?.is_correct) {
      updatedQueue = updatedQueue.slice(1);
    } else {
      // Re-queued: move head to end
      const head = updatedQueue[0];
      updatedQueue = [...updatedQueue.slice(1), head];
    }

    // Check if lesson complete
    if (updatedQueue.length === 0) {
      try {
        const comp = await api.completeAttempt(attemptId);
        sfx.play('fanfare');
        set({
          status: 'complete',
          completionData: comp,
          queue: [],
          currentExercise: null,
        });
      } catch (err) {
        console.error('Failed to complete attempt:', err);
      }
      return;
    }

    // Find next exercise
    const nextId = updatedQueue[0];
    const nextEx = exercises.find((e) => e.id === nextId) || null;

    set({
      queue: updatedQueue,
      currentExercise: nextEx,
      draftAnswer: null,
      status: 'answering',
      lastFeedback: null,
      startTime: Date.now(),
    });
  },

  reset: () =>
    set({
      attemptId: null,
      exercises: [],
      queue: [],
      currentExercise: null,
      draftAnswer: null,
      status: 'answering',
      lastFeedback: null,
      completionData: null,
    }),
}));
