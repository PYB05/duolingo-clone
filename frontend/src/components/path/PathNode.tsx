'use client';

import React from 'react';
import { ChestIcon, CheckIcon, CrownIcon, HeadphonesIcon, LockIcon, StarIcon, TrophyIcon } from '../icons';
import { cn } from '@/lib/utils';
import { sfx } from '@/lib/sfx';

export interface PathNodeProps {
  id: number;
  kind: 'skill' | 'chest' | 'unit_review';
  title: string;
  state: 'locked' | 'available' | 'in_progress' | 'completed' | 'legendary';
  isCurrent?: boolean;
  lessonsCompleted: number;
  totalLevels: number;
  themeColor: string;
  themeShadowColor: string;
  chestOpened?: boolean;
  offsetX?: number;
  iconType?: 'star' | 'headphones' | 'check' | 'chest' | 'book';
  onClick: () => void;
}

export function PathNode({
  kind,
  title,
  state,
  isCurrent = false,
  lessonsCompleted,
  totalLevels,
  themeColor,
  themeShadowColor,
  chestOpened = false,
  offsetX = 0,
  iconType,
  onClick,
}: PathNodeProps) {
  const isLocked = state === 'locked';
  const isCompleted = state === 'completed';
  const isLegendary = state === 'legendary';

  const handleClick = () => {
    sfx.play('tap');
    onClick();
  };

  // Node background & 3D bevel bottom colors
  let bgColor = themeColor;
  let shadowColor = themeShadowColor;

  if (isLocked) {
    bgColor = 'var(--color-node-locked-bg, #E5E5E5)'; 
    shadowColor = 'var(--color-node-locked-shadow, #AFAFAF)';
  } else if (isLegendary) {
    bgColor = '#CE82FF'; // beetle
    shadowColor = '#A568CC';
  } else if (isCompleted) {
    // Completed nodes use the unit theme color or gold with white checkmark
    bgColor = themeColor;
    shadowColor = themeShadowColor;
  }

  // Chest node renders full 3D chest directly without circle wrapper
  if (kind === 'chest') {
    return (
      <div
        className="relative flex flex-col items-center my-6 transition-transform duration-200 select-none cursor-pointer"
        style={{ transform: `translateX(${offsetX}px)` }}
        onClick={handleClick}
      >
        <div className="hover:scale-105 active:scale-95 transition-transform">
          <ChestIcon className="w-20 h-20" opened={chestOpened} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col items-center my-3 transition-transform duration-200 select-none"
      style={{ transform: `translateX(${offsetX}px)` }}
    >
      {/* 1. START Tooltip Bubble for current lesson */}
      {isCurrent && !isLocked && (
        <div className="absolute -top-10 z-30 animate-bounce pointer-events-none">
          <div className="bg-white dark:bg-[#202F36] border-2 border-[#E5E5E5] dark:border-[#37464F] text-[#58CC02] dark:text-white font-black text-xs uppercase px-3 py-1.5 rounded-xl shadow-lg tracking-widest flex items-center justify-center">
            <span>START</span>
            {/* Triangle pointer downward */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-[#202F36] border-b-2 border-r-2 border-[#E5E5E5] dark:border-[#37464F] rotate-45" />
          </div>
        </div>
      )}

      {/* 2. Outer Progress Ring on Active Node */}
      {isCurrent && !isLocked && (
        <div className="absolute -inset-2.5 rounded-full border-[5px] border-[#E5E5E5] dark:border-[#37464F] pointer-events-none" />
      )}

      {/* 3. Main 3D Node Button (76px diameter, thick 3D base) */}
      <button
        onClick={handleClick}
        className={cn(
          'relative w-[76px] h-[76px] rounded-full flex items-center justify-center transition-all duration-75 active:translate-y-1 z-10 shadow-md',
          isCurrent && 'hover:brightness-110 active:brightness-95',
          isLocked && 'opacity-90'
        )}
        style={{
          backgroundColor: bgColor,
          borderBottom: `7px solid ${shadowColor}`,
        }}
      >
        {/* Subtle Specular Highlight Curve on top of circle */}
        <div className="absolute top-1 left-3 right-3 h-3 bg-white/20 rounded-t-full pointer-events-none" />

        {/* Node Icon */}
        {isCompleted ? (
          <CheckIcon className="w-8 h-8 text-white stroke-[4]" />
        ) : iconType === 'headphones' ? (
          <HeadphonesIcon className="w-7 h-7 text-white" />
        ) : kind === 'unit_review' ? (
          <TrophyIcon className="w-8 h-8 text-white" />
        ) : isLocked ? (
          <LockIcon className="w-7 h-7 text-[#829BA8]" />
        ) : (
          <StarIcon className="w-8 h-8 text-white" />
        )}

        {/* Crown Badge on Legendary/Mastered Skills */}
        {isLegendary && (
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border-2 border-swan shadow">
            <CrownIcon className="w-4 h-4 text-bee" />
          </div>
        )}
      </button>
    </div>
  );
}
