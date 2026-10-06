'use client';

import React, { useEffect } from 'react';
import { SubmitAnswerResponse } from '@/types/api';
import { CheckIcon, CrossIcon } from '../icons';
import { Button } from '../ui/Button';

export interface FeedbackBarProps {
  feedback: SubmitAnswerResponse;
  onContinue: () => void;
}

const PRAISES = ['Great job!', 'Awesome!', 'Nicely done!', 'Excellent!', 'Amazing!', 'Correct!'];

export function FeedbackBar({ feedback, onContinue }: FeedbackBarProps) {
  // Random praise on correct
  const praise = PRAISES[Math.floor(Math.random() * PRAISES.length)];

  // Enter key continues
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onContinue]);

  const isCorrect = feedback.is_correct;
  const isTypo = feedback.is_typo;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 p-4 sm:p-6 z-40 transition-transform duration-200 ease-out border-t-2 select-none ${
        isCorrect
          ? isTypo
            ? 'bg-amber-100 border-amber-300'
            : 'bg-correct-bg border-feather'
          : 'bg-wrong-bg border-cardinal'
      }`}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Status & Details */}
        <div className="flex items-start gap-4 w-full sm:w-auto">
          {/* Icon Badge */}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
              isCorrect
                ? isTypo
                  ? 'bg-amber-500 text-white'
                  : 'bg-feather text-white'
                : 'bg-cardinal text-white'
            }`}
          >
            {isCorrect ? <CheckIcon className="w-7 h-7" /> : <CrossIcon className="w-7 h-7" />}
          </div>

          <div className="flex flex-col">
            <h3
              className={`text-xl font-black ${
                isCorrect
                  ? isTypo
                    ? 'text-amber-800'
                    : 'text-feather'
                  : 'text-cardinal'
              }`}
            >
              {isCorrect ? (isTypo ? 'Almost correct!' : praise) : 'Correct solution:'}
            </h3>

            {/* Note or Correct solution text */}
            {isTypo && feedback.note && (
              <p className="text-sm font-bold text-amber-900 mt-0.5">{feedback.note}</p>
            )}

            {!isCorrect && (
              <p className="text-base font-bold text-cardinal mt-0.5">
                {feedback.correct_answer}
              </p>
            )}

            {feedback.alternatives && feedback.alternatives.length > 0 && (
              <p className="text-xs font-bold text-wolf mt-1">
                Another solution: {feedback.alternatives[0]}
              </p>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <div className="w-full sm:w-auto">
          <Button
            variant={isCorrect ? (isTypo ? 'primary' : 'primary') : 'danger'}
            size="lg"
            fullWidth
            onClick={onContinue}
          >
            CONTINUE
          </Button>
        </div>
      </div>
    </div>
  );
}
