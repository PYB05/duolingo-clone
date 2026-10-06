'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CompleteAttemptResponse } from '@/types/api';
import { OwlMascot } from '../mascot/OwlMascot';
import { BoltIcon, FlameIcon } from '../icons';
import { Button } from '../ui/Button';

export interface CompleteScreenProps {
  data: CompleteAttemptResponse;
  onContinue: () => void;
}

export function CompleteScreen({ data, onContinue }: CompleteScreenProps) {
  useEffect(() => {
    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore if confetti not supported
    }
  }, []);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full flex flex-col items-center justify-between min-h-[85vh] py-8 max-w-xl mx-auto select-none">
      <div className="flex flex-col items-center text-center mt-4">
        {/* Celebrating Mascot */}
        <OwlMascot expression="celebrating" className="w-36 h-36 mb-4 animate-bounce" />

        <h1 className="text-3xl sm:text-4xl font-black text-bee mb-2">
          {data.is_perfect ? 'Perfect Lesson!' : 'Lesson Complete!'}
        </h1>
        <p className="text-sm font-bold text-wolf">
          You made great progress today. Keep it up!
        </p>

        {/* 3 Stat Cards Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full mt-8">
          {/* Total XP Card */}
          <div className="p-4 rounded-2xl border-2 border-bee border-b-4 bg-amber-50 flex flex-col items-center">
            <span className="text-xs font-black uppercase text-amber-700 mb-1">
              TOTAL XP
            </span>
            <div className="flex items-center gap-1 text-2xl font-black text-amber-600">
              <BoltIcon className="w-6 h-6" />
              <span>+{data.xp.total}</span>
            </div>
          </div>

          {/* Accuracy Card */}
          <div className="p-4 rounded-2xl border-2 border-feather border-b-4 bg-emerald-50 flex flex-col items-center">
            <span className="text-xs font-black uppercase text-emerald-700 mb-1">
              ACCURACY
            </span>
            <div className="flex items-center gap-1 text-2xl font-black text-emerald-600">
              <span>{Math.round(data.accuracy * 100)}%</span>
            </div>
          </div>

          {/* Speedy / Time Card */}
          <div className="p-4 rounded-2xl border-2 border-macaw border-b-4 bg-sky flex flex-col items-center">
            <span className="text-xs font-black uppercase text-sky-800 mb-1">
              COMMITTED
            </span>
            <div className="flex items-center gap-1 text-2xl font-black text-macaw">
              <span>{formatDuration(data.duration_seconds)}</span>
            </div>
          </div>
        </div>

        {/* Streak milestone note */}
        {data.streak.extended && (
          <div className="mt-6 flex items-center gap-2 p-3 bg-orange-50 border border-fox rounded-2xl text-xs font-extrabold text-fox">
            <FlameIcon className="w-5 h-5" active={true} />
            <span>Streak extended to {data.streak.after} days!</span>
          </div>
        )}
      </div>

      {/* Footer Continue */}
      <div className="w-full pt-8 border-t border-swan">
        <Button variant="primary" size="lg" fullWidth onClick={onContinue}>
          CONTINUE
        </Button>
      </div>
    </div>
  );
}
