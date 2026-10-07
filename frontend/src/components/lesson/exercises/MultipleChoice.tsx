'use client';

import React, { useEffect, useCallback } from 'react';
import { SanitizedExercise } from '@/types/api';
import { OptionCard } from '@/components/ui/OptionCard';
import { SpeakerIcon } from '@/components/icons';
import { ExerciseIllustration } from '@/components/icons/ExerciseIcons';
import { speakText } from '@/lib/tts';

export interface ExerciseProps {
  exercise: SanitizedExercise;
  draftAnswer: any;
  onAnswerChange: (answer: any) => void;
  disabled?: boolean;
}

export function MultipleChoice({
  exercise,
  draftAnswer,
  onAnswerChange,
  disabled = false,
}: ExerciseProps) {
  const selectedId = draftAnswer?.option_id;

  const handleSelect = useCallback(
    (optionId: number) => {
      if (disabled) return;
      onAnswerChange({ option_id: optionId });
    },
    [disabled, onAnswerChange]
  );

  // Keyboard shortcut listener (1..4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= exercise.options.length) {
        handleSelect(exercise.options[num - 1].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, exercise.options, handleSelect]);

  const hasMedia = exercise.options.some((o) => !!o.emoji || !!(o as any).image_url);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Prompt header */}
      <div className="flex items-center gap-3 mb-8">
        {exercise.audio_text && (
          <button
            onClick={() => speakText(exercise.audio_text!)}
            className="p-3 bg-macaw text-white rounded-2xl hover:brightness-105 active:scale-95 transition-all shadow-md"
          >
            <SpeakerIcon className="w-6 h-6" />
          </button>
        )}
        <h3 className="text-xl sm:text-2xl font-black text-eel">
          {exercise.prompt_text}
        </h3>
      </div>

      {/* Options Grid */}
      <div
        className={`w-full grid gap-4 ${
          hasMedia ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1'
        }`}
      >
        {exercise.options.map((opt, idx) => (
          <OptionCard
            key={opt.id}
            selected={selectedId === opt.id}
            disabled={disabled}
            onClick={() => handleSelect(opt.id)}
            numberHint={idx + 1}
            className={hasMedia ? 'flex-col justify-center text-center py-6 min-h-[160px]' : 'py-4'}
          >
            <ExerciseIllustration text={opt.text} emoji={opt.emoji} className="w-16 h-16 mb-2" />
            <span className="text-base sm:text-lg font-bold">{opt.text}</span>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}
