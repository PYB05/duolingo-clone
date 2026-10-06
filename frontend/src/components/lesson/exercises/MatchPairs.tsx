'use client';

import React, { useState } from 'react';
import { SanitizedExercise, SanitizedOption } from '@/types/api';
import { sfx } from '@/lib/sfx';
import { cn } from '@/lib/utils';

export interface MatchPairsProps {
  exercise: SanitizedExercise;
  draftAnswer: any;
  onAnswerChange: (answer: any) => void;
  disabled?: boolean;
}

export function MatchPairs({
  exercise,
  draftAnswer,
  onAnswerChange,
  disabled = false,
}: MatchPairsProps) {
  const leftOptions = exercise.options.filter((o) => o.side === 'left');
  const rightOptions = exercise.options.filter((o) => o.side === 'right');

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[][]>(draftAnswer?.pairs || []);
  const [failedTileIds] = useState<number[]>([]);

  const matchedSet = new Set(matchedPairs.flat());

  const handleTileClick = (opt: SanitizedOption) => {
    if (disabled || matchedSet.has(opt.id)) return;
    sfx.play('tap');

    if (opt.side === 'left') {
      if (selectedLeft === opt.id) {
        setSelectedLeft(null);
        return;
      }
      setSelectedLeft(opt.id);

      if (selectedRight !== null) {
        evaluatePair(opt.id, selectedRight);
      }
    } else {
      if (selectedRight === opt.id) {
        setSelectedRight(null);
        return;
      }
      setSelectedRight(opt.id);

      if (selectedLeft !== null) {
        evaluatePair(selectedLeft, opt.id);
      }
    }
  };

  const evaluatePair = (leftId: number, rightId: number) => {
    // Add tentative pair and check
    const newPairs = [...matchedPairs, [leftId, rightId]];
    setSelectedLeft(null);
    setSelectedRight(null);

    // Update draft answer with pairs so Check button / auto-eval works
    onAnswerChange({ pairs: newPairs });
    setMatchedPairs(newPairs);
    sfx.play('correct');
  };

  return (
    <div className="w-full flex justify-center py-4">
      <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-md">
        {/* Left Column */}
        <div className="flex flex-col gap-3">
          {leftOptions.map((opt) => {
            const isSelected = selectedLeft === opt.id;
            const isMatched = matchedSet.has(opt.id);
            const isFailed = failedTileIds.includes(opt.id);

            return (
              <button
                key={opt.id}
                disabled={disabled || isMatched}
                onClick={() => handleTileClick(opt)}
                className={cn(
                  'p-4 rounded-2xl border-2 border-b-4 font-extrabold text-sm sm:text-base text-center transition-all select-none',
                  isMatched
                    ? 'bg-correct-bg border-feather text-feather opacity-40 cursor-default'
                    : isFailed
                    ? 'bg-wrong-bg border-cardinal text-cardinal animate-shake'
                    : isSelected
                    ? 'bg-sky border-sky-border text-macaw'
                    : 'bg-white border-swan text-eel hover:bg-polar active:translate-y-1'
                )}
              >
                {opt.text}
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3">
          {rightOptions.map((opt) => {
            const isSelected = selectedRight === opt.id;
            const isMatched = matchedSet.has(opt.id);
            const isFailed = failedTileIds.includes(opt.id);

            return (
              <button
                key={opt.id}
                disabled={disabled || isMatched}
                onClick={() => handleTileClick(opt)}
                className={cn(
                  'p-4 rounded-2xl border-2 border-b-4 font-extrabold text-sm sm:text-base text-center transition-all select-none',
                  isMatched
                    ? 'bg-correct-bg border-feather text-feather opacity-40 cursor-default'
                    : isFailed
                    ? 'bg-wrong-bg border-cardinal text-cardinal animate-shake'
                    : isSelected
                    ? 'bg-sky border-sky-border text-macaw'
                    : 'bg-white border-swan text-eel hover:bg-polar active:translate-y-1'
                )}
              >
                {opt.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
