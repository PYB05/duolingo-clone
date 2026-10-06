'use client';

import React from 'react';
import { SanitizedExercise } from '@/types/api';
import { OptionCard } from '@/components/ui/OptionCard';

export interface FillBlankProps {
  exercise: SanitizedExercise;
  draftAnswer: any;
  onAnswerChange: (answer: any) => void;
  disabled?: boolean;
}

export function FillBlank({
  exercise,
  draftAnswer,
  onAnswerChange,
  disabled = false,
}: FillBlankProps) {
  const selectedId = draftAnswer?.option_id;
  const selectedOption = exercise.options.find((o) => o.id === selectedId);

  // Render sentence with gap replaced by selected word or underline
  const parts = (exercise.sentence_with_blank || '____').split('____');

  return (
    <div className="w-full flex flex-col items-center">
      {/* Sentence with Gap */}
      <div className="text-xl sm:text-2xl font-black text-eel mb-10 text-center leading-relaxed">
        <span>{parts[0]}</span>
        <span className="inline-block border-b-4 border-macaw px-3 mx-1 text-macaw min-w-[70px] text-center">
          {selectedOption ? selectedOption.text : '____'}
        </span>
        <span>{parts[1] || ''}</span>

        {exercise.prompt_text && (
          <p className="text-sm font-bold text-wolf mt-2 italic">{exercise.prompt_text}</p>
        )}
      </div>

      {/* Option Tiles below */}
      <div className="flex flex-wrap justify-center gap-4 w-full max-w-md">
        {exercise.options.map((opt, idx) => (
          <OptionCard
            key={opt.id}
            selected={selectedId === opt.id}
            disabled={disabled}
            onClick={() => onAnswerChange({ option_id: opt.id })}
            numberHint={idx + 1}
            className="w-full sm:w-auto min-w-[120px] justify-center"
          >
            <span className="text-base font-extrabold">{opt.text}</span>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}
