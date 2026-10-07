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
  // Deterministically or randomly shuffle right options so pairs are never directly opposite each other
  const leftOptions = React.useMemo(
    () => exercise.options.filter((o) => o.side === 'left'),
    [exercise.options]
  );

  const rightOptions = React.useMemo(() => {
    const rawRight = exercise.options.filter((o) => o.side === 'right');
    // Fisher-Yates shuffle
    const shuffled = [...rawRight];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // If it accidentally ended up in the same index order as left, rotate by 1
    if (
      shuffled.length > 1 &&
      shuffled.every((item, idx) => item.id === leftOptions[idx]?.id)
    ) {
      shuffled.push(shuffled.shift()!);
    }
    return shuffled;
  }, [exercise.options, leftOptions]);

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
                  'p-4 rounded-2xl border-2 border-b-4 font-black text-sm sm:text-base text-center transition-all select-none',
                  isMatched
                    ? 'bg-[#58CC02]/20 border-[#58CC02] text-[#58CC02] opacity-40 cursor-default shadow-none border-b-2 translate-y-1'
                    : isFailed
                    ? 'bg-[#FF4B4B]/20 border-[#FF4B4B] text-[#FF4B4B] animate-shake'
                    : isSelected
                    ? 'bg-[#DDF4FF] dark:bg-[#202F36] border-[#84D8FF] text-[#1CB0F6]'
                    : 'bg-white dark:bg-[#202F36] border-[#E5E5E5] dark:border-[#37464F] text-[#3C3C3C] dark:text-[#F1F7FB] hover:bg-[#F7F7F7] dark:hover:bg-[#263842] active:translate-y-1'
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
                  'p-4 rounded-2xl border-2 border-b-4 font-black text-sm sm:text-base text-center transition-all select-none',
                  isMatched
                    ? 'bg-[#58CC02]/20 border-[#58CC02] text-[#58CC02] opacity-40 cursor-default shadow-none border-b-2 translate-y-1'
                    : isFailed
                    ? 'bg-[#FF4B4B]/20 border-[#FF4B4B] text-[#FF4B4B] animate-shake'
                    : isSelected
                    ? 'bg-[#DDF4FF] dark:bg-[#202F36] border-[#84D8FF] text-[#1CB0F6]'
                    : 'bg-white dark:bg-[#202F36] border-[#E5E5E5] dark:border-[#37464F] text-[#3C3C3C] dark:text-[#F1F7FB] hover:bg-[#F7F7F7] dark:hover:bg-[#263842] active:translate-y-1'
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
