'use client';

import React from 'react';
import { OwlMascot } from '@/components/mascot/OwlMascot';

interface DuoLoadingScreenProps {
  message?: string;
  subtext?: string;
}

export function DuoLoadingScreen({
  message = 'LOADING...',
  subtext = 'Duo is getting your lesson ready!',
}: DuoLoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] py-12 px-4 select-none animate-in fade-in duration-300">
      {/* Animated Floating Duo with Shadow */}
      <div className="relative flex flex-col items-center mb-6">
        <div className="animate-duo-bob">
          <OwlMascot expression="thinking" className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-xl" />
        </div>
        {/* Pulsing Floor Shadow */}
        <div className="w-20 h-4 bg-black/15 dark:bg-black/40 rounded-full blur-[2px] animate-shadow-pulse -mt-2" />
      </div>

      {/* Progress Dots Loader */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 rounded-full bg-[#58CC02] animate-bounce [animation-delay:-0.3s]" />
        <div className="w-3 h-3 rounded-full bg-[#1CB0F6] animate-bounce [animation-delay:-0.15s]" />
        <div className="w-3 h-3 rounded-full bg-[#FFC800] animate-bounce" />
      </div>

      {/* Loading Label */}
      <h3 className="text-base sm:text-lg font-black tracking-widest uppercase text-[#3C3C3C] dark:text-[#F1F7FB] text-center">
        {message}
      </h3>
      {subtext && (
        <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#829BA8] mt-1 text-center max-w-xs">
          {subtext}
        </p>
      )}
    </div>
  );
}
