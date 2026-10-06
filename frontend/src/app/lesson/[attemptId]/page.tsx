'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLessonStore } from '@/store/lessonStore';
import { CrossIcon, HeartIcon } from '@/components/icons';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { ExitModal } from '@/components/lesson/ExitModal';
import { OutOfHeartsModal } from '@/components/lesson/OutOfHeartsModal';
import { FeedbackBar } from '@/components/lesson/FeedbackBar';
import { CompleteScreen } from '@/components/lesson/CompleteScreen';
import { MultipleChoice } from '@/components/lesson/exercises/MultipleChoice';
import { WordBank } from '@/components/lesson/exercises/WordBank';
import { MatchPairs } from '@/components/lesson/exercises/MatchPairs';
import { FillBlank } from '@/components/lesson/exercises/FillBlank';
import { TypeAnswer } from '@/components/lesson/exercises/TypeAnswer';
import { api } from '@/lib/api';

export default function LessonPlayerPage() {
  const router = useRouter();

  const {
    currentExercise,
    draftAnswer,
    status,
    hearts,
    lastFeedback,
    completionData,
    totalExercises,
    correctCount,
    setDraftAnswer,
    checkAnswer,
    skipExercise,
    nextExercise,
  } = useLessonStore();

  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [outOfHeartsModalOpen, setOutOfHeartsModalOpen] = useState(false);

  useEffect(() => {
    if (status === 'failed') {
      setOutOfHeartsModalOpen(true);
    }
  }, [status]);

  // Handle window beforeunload guard
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (status === 'answering' || status === 'feedback') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [status]);

  // Keyboard shortcut: Enter to Check when draft is set
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && status === 'answering' && draftAnswer) {
        e.preventDefault();
        checkAnswer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, draftAnswer, checkAnswer]);

  if (status === 'complete' && completionData) {
    return <CompleteScreen data={completionData} onContinue={() => router.push('/learn')} />;
  }

  if (!currentExercise) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen duo-bg-page">
        <p className="font-bold duo-text-secondary">No active exercise found.</p>
        <Button variant="secondary" size="md" className="mt-4" onClick={() => router.push('/learn')}>
          RETURN HOME
        </Button>
      </div>
    );
  }

  const progressPercent = totalExercises > 0 ? (correctCount / totalExercises) * 100 : 0;
  const canCheck = Boolean(draftAnswer);

  return (
    <div className="min-h-screen duo-bg-page flex flex-col justify-between select-none">
      {/* 1. Header */}
      <header className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        {/* Exit cross */}
        <button
          onClick={() => setExitModalOpen(true)}
          className="p-2 duo-text-muted hover:duo-text-primary transition-colors rounded-xl"
        >
          <CrossIcon className="w-6 h-6" />
        </button>

        {/* Progress bar in center */}
        <div className="flex-1 max-w-xl mx-4">
          <ProgressBar progress={progressPercent} color="feather" />
        </div>

        {/* Hearts on right */}
        <div className="flex items-center gap-1.5 font-black text-sm text-cardinal">
          <HeartIcon className="w-6 h-6" active={hearts > 0} />
          <span>{hearts}</span>
        </div>
      </header>

      {/* 2. Body — Centered Exercise */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col items-center justify-center">
        {/* Instruction line */}
        <h2 className="text-xl sm:text-2xl font-black duo-text-primary mb-6 text-center w-full">
          {currentExercise.instruction}
        </h2>

        {/* Exercise Component Switcher */}
        {currentExercise.type === 'multiple_choice' && (
          <MultipleChoice
            exercise={currentExercise}
            draftAnswer={draftAnswer}
            onAnswerChange={setDraftAnswer}
            disabled={status !== 'answering'}
          />
        )}

        {(currentExercise.type === 'translate_word_bank' || currentExercise.type === 'listen_tap') && (
          <WordBank
            exercise={currentExercise}
            draftAnswer={draftAnswer}
            onAnswerChange={setDraftAnswer}
            disabled={status !== 'answering'}
          />
        )}

        {currentExercise.type === 'match_pairs' && (
          <MatchPairs
            exercise={currentExercise}
            draftAnswer={draftAnswer}
            onAnswerChange={setDraftAnswer}
            disabled={status !== 'answering'}
          />
        )}

        {currentExercise.type === 'fill_in_blank' && (
          <FillBlank
            exercise={currentExercise}
            draftAnswer={draftAnswer}
            onAnswerChange={setDraftAnswer}
            disabled={status !== 'answering'}
          />
        )}

        {(currentExercise.type === 'type_answer' || currentExercise.type === 'listen_type') && (
          <TypeAnswer
            exercise={currentExercise}
            draftAnswer={draftAnswer}
            onAnswerChange={setDraftAnswer}
            disabled={status !== 'answering'}
          />
        )}

        {currentExercise.type === 'speak' && (
          <div className="text-center py-10">
            <p className="text-lg font-black duo-text-primary mb-4">Speaking exercises are coming soon!</p>
            <Button variant="secondary" size="md" onClick={skipExercise}>
              SKIP FOR FREE
            </Button>
          </div>
        )}
      </main>

      {/* 3. Footer (Check / Skip) */}
      <footer className="border-t-2 duo-border py-4 px-6 duo-bg-surface z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Button variant="ghost" size="md" onClick={skipExercise} disabled={status !== 'answering'}>
            SKIP
          </Button>

          <Button
            variant="primary"
            size="lg"
            onClick={checkAnswer}
            disabled={!canCheck || status !== 'answering'}
          >
            CHECK
          </Button>
        </div>
      </footer>

      {/* 4. Sliding Feedback Bar */}
      {status === 'feedback' && lastFeedback && (
        <FeedbackBar feedback={lastFeedback} onContinue={nextExercise} />
      )}

      {/* 5. Modals */}
      <ExitModal
        isOpen={exitModalOpen}
        onClose={() => setExitModalOpen(false)}
        onConfirmExit={() => {
          setExitModalOpen(false);
          router.push('/learn');
        }}
      />

      <OutOfHeartsModal
        isOpen={outOfHeartsModalOpen}
        onClose={() => setOutOfHeartsModalOpen(false)}
        gems={500}
        onRefill={async () => {
          try {
            await api.purchaseItem('heart_refill');
            setOutOfHeartsModalOpen(false);
          } catch (err: any) {
            alert(err.message || 'Could not refill hearts.');
          }
        }}
      />
    </div>
  );
}
