'use client';

import React, { useMemo, useEffect } from 'react';
import { SanitizedExercise } from '@/types/api';
import { OwlMascot } from '@/components/mascot/OwlMascot';
import { SpeakerIcon } from '@/components/icons';
import { speakText } from '@/lib/tts';
import { sfx } from '@/lib/sfx';

export interface WordBankProps {
  exercise: SanitizedExercise;
  draftAnswer: any;
  onAnswerChange: (answer: any) => void;
  disabled?: boolean;
}

export function WordBank({
  exercise,
  draftAnswer,
  onAnswerChange,
  disabled = false,
}: WordBankProps) {
  // Ordered placed option IDs
  const placedIds: number[] = useMemo(() => draftAnswer?.tokens || [], [draftAnswer?.tokens]);

  const handleTileClick = (optionId: number) => {
    if (disabled) return;
    sfx.play('tap');

    let updated: number[];
    if (placedIds.includes(optionId)) {
      // Remove from placed
      updated = placedIds.filter((id) => id !== optionId);
    } else {
      // Add to placed
      updated = [...placedIds, optionId];
    }
    onAnswerChange({ tokens: updated });
  };

  // Backspace key listener to remove last placed tile
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'Backspace' && placedIds.length > 0) {
        onAnswerChange({ tokens: placedIds.slice(0, -1) });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, placedIds, onAnswerChange]);

  const placedOptions = placedIds
    .map((id) => exercise.options.find((o) => o.id === id))
    .filter(Boolean);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Mascot with Speech Bubble */}
      <div className="flex items-center gap-4 mb-8 w-full max-w-lg">
        <OwlMascot expression="thinking" className="w-20 h-20 shrink-0" />
        <div className="relative bg-white border-2 border-swan p-4 rounded-2xl shadow-sm flex items-center gap-3">
          {exercise.audio_text && (
            <button
              onClick={() => speakText(exercise.audio_text!)}
              className="p-2 bg-macaw text-white rounded-xl hover:brightness-105 active:scale-95 transition-all"
            >
              <SpeakerIcon className="w-5 h-5" />
            </button>
          )}
          <span className="text-lg font-black text-eel">{exercise.prompt_text}</span>
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-l-2 border-b-2 border-swan rotate-45" />
        </div>
      </div>

      {/* Answer Line Area (Writing lines) */}
      <div className="w-full min-h-[72px] border-b-2 border-t-2 border-swan py-3 px-2 flex flex-wrap gap-2 mb-8 bg-polar/50 rounded-xl items-center">
        {placedOptions.length === 0 ? (
          <span className="text-hare text-sm font-bold italic px-2">
            Tap tiles from the bank below to build your answer...
          </span>
        ) : (
          placedOptions.map((opt) => (
            <button
              key={opt!.id}
              disabled={disabled}
              onClick={() => handleTileClick(opt!.id)}
              className="px-4 py-2.5 bg-white border-2 border-swan border-b-4 rounded-xl font-bold text-eel text-sm shadow-sm hover:brightness-95 active:translate-y-1 transition-all"
            >
              {opt!.text}
            </button>
          ))
        )}
      </div>

      {/* Shuffled Word Bank with Ghost Slots */}
      <div className="flex flex-wrap justify-center gap-2.5 max-w-md">
        {exercise.options.map((opt) => {
          const isPlaced = placedIds.includes(opt.id);

          return isPlaced ? (
            // Ghost slot
            <div
              key={opt.id}
              className="px-4 py-2.5 bg-swan/50 border-2 border-transparent rounded-xl font-bold text-transparent text-sm select-none"
            >
              {opt.text}
            </div>
          ) : (
            // Available bank tile
            <button
              key={opt.id}
              disabled={disabled}
              onClick={() => handleTileClick(opt.id)}
              className="px-4 py-2.5 bg-white border-2 border-swan border-b-4 rounded-xl font-bold text-eel text-sm shadow hover:bg-polar active:translate-y-1 transition-all"
            >
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
