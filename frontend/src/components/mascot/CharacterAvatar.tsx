'use client';

import React, { useState } from 'react';
import { sfx } from '@/lib/sfx';

export type CharacterType = 'duo' | 'junior' | 'bea' | 'lin' | 'lily' | 'zari';

interface CharacterAvatarProps {
  character?: CharacterType;
  className?: string;
}

const LILY_QUOTES = [
  'Whatever...',
  'Keep going, I guess.',
  'Cool.',
  'Ugh, fine.',
  'Not bad.',
];

const JUNIOR_QUOTES = [
  'You got this!',
  '¡Vamos!',
  'High five! ✋',
  'Super fast!',
];

const BEA_QUOTES = [
  'Fascinating!',
  'Great focus.',
  'Keep the streak alive!',
];

export function CharacterAvatar({ character = 'lily', className = 'w-32 h-32' }: CharacterAvatarProps) {
  const [quote, setQuote] = useState<string | null>(null);
  const [clicked, setClicked] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sfx.play('tap');
    setClicked(true);
    setTimeout(() => setClicked(false), 600);

    const quotes =
      character === 'lily'
        ? LILY_QUOTES
        : character === 'junior'
        ? JUNIOR_QUOTES
        : BEA_QUOTES;

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);

    setTimeout(() => {
      setQuote(null);
    }, 2400);
  };

  if (character === 'lily') {
    // Lily: Authentic animated purple hair emo girl holding hoodie jacket (exact match from user screenshot)
    return (
      <div
        className="relative inline-flex flex-col items-center cursor-pointer group select-none pointer-events-auto"
        onClick={handleClick}
      >
        {/* Floating Interactive Speech Bubble */}
        {quote && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 animate-in fade-in zoom-in-95 duration-200 pointer-events-none whitespace-nowrap">
            <div className="bg-[#202F36] border-2 border-[#37464F] text-[#F1F7FB] font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5">
              <span>{quote}</span>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#202F36] border-b-2 border-r-2 border-[#37464F] rotate-45" />
            </div>
          </div>
        )}

        <svg
          viewBox="0 0 120 140"
          fill="none"
          className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${clicked ? 'scale-95' : ''} ${className}`}
        >
          {/* 1. Breathing Ground Shadow */}
          <ellipse cx="60" cy="132" rx="36" ry="7" fill="#000000" className="animate-shadow-pulse" />

          {/* 2. Static Lower Legs & Boots */}
          <g>
            <rect x="46" y="98" width="8" height="24" rx="4" fill="#4B3363" />
            <rect x="66" y="98" width="8" height="24" rx="4" fill="#4B3363" />
            <path d="M48 118 L46 130 C46 132 40 133 36 132 C34 130 36 126 38 124 L42 118 Z" fill="#20152B" />
            <path d="M68 118 L70 130 C70 132 76 133 80 132 C82 130 80 126 78 124 L74 118 Z" fill="#20152B" />
          </g>

          {/* 3. Breathing Torso Group */}
          <g className="animate-lily-torso">
            {/* Purple Emo Tunic / Dress */}
            <path d="M38 78 Q32 94 36 102 Q60 106 84 102 Q88 94 82 78 Z" fill="#3D2059" />
            <path d="M46 72 Q60 76 74 72 L78 82 Q60 86 42 82 Z" fill="#2D1542" />

            {/* Left Arm & Dropped Sleeve with dangling physics */}
            <path d="M32 82 Q24 94 28 106 L34 102 Q32 92 38 84 Z" fill="#FFDCB2" />
            <g className="animate-lily-garment-left">
              <path d="M22 96 Q16 112 24 126 Q32 128 34 116 Q34 102 26 96 Z" fill="#3A294C" />
              <path d="M25 102 L20 120 L27 124 L31 106 Z" fill="#2E1F3D" />
            </g>

            {/* Right Arm & Iconic Hanging Jacket with sway animation */}
            <path d="M78 82 Q88 92 92 88 Q96 84 90 78 Z" fill="#FFDCB2" />
            <g className="animate-lily-garment-right">
              <path d="M86 86 L108 88 L106 112 L96 114 L96 98 L88 98 Z" fill="#433256" />
              <path d="M96 98 L96 114 L88 114 L88 98 Z" fill="#352646" />
            </g>

            {/* Neck */}
            <rect x="54" y="62" width="12" height="14" rx="4" fill="#FFDCB2" />
          </g>

          {/* 4. Animated Head Group (Tilts & Bobs) */}
          <g className="animate-lily-head">
            {/* Head Base */}
            <circle cx="60" cy="52" r="22" fill="#FFDCB2" />

            {/* Signature Lavender Purple Bob Haircut */}
            <path
              d="M32 46 C28 22 42 10 60 10 C78 10 92 22 88 46 C88 64 86 78 82 82 C78 68 76 56 74 54 C66 60 52 60 46 54 C44 56 42 68 38 82 C34 78 32 64 32 46 Z"
              fill="#A47BFF"
            />

            {/* Animated Bangs */}
            <g className="animate-lily-bangs">
              <path
                d="M34 40 C44 26 76 26 86 40 C84 48 76 52 70 48 C62 56 48 56 40 48 C36 50 34 46 34 40 Z"
                fill="#8A5BFF"
              />
              <path d="M38 34 C44 20 74 20 80 34 C76 30 64 26 58 30 C50 26 42 30 38 34 Z" fill="#BFA3FF" />
            </g>

            {/* Eyes Group with Sarcastic Eye Blinking & Glancing */}
            <g className="animate-eye-blink">
              {/* Left Eyebrow & Eye */}
              <path d="M44 48 Q52 46 56 50" stroke="#2B1838" strokeWidth="3.5" strokeLinecap="round" />
              <g className="animate-pupil-glance">
                <ellipse cx="50" cy="52" rx="3.2" ry="2.4" fill="#2B1838" />
                <circle cx="51" cy="51.5" r="0.8" fill="#FFFFFF" />
              </g>

              {/* Right Eyebrow & Eye */}
              <path d="M64 50 Q68 46 76 48" stroke="#2B1838" strokeWidth="3.5" strokeLinecap="round" />
              <g className="animate-pupil-glance">
                <ellipse cx="70" cy="52" rx="3.2" ry="2.4" fill="#2B1838" />
                <circle cx="71" cy="51.5" r="0.8" fill="#FFFFFF" />
              </g>
            </g>

            {/* Deadpan Mouth Line */}
            <path d="M54 62 L64 61" stroke="#8A4A5A" strokeWidth="2.5" strokeLinecap="round" />

            {/* Subtle Nose */}
            <circle cx="59" cy="56" r="1.5" fill="#DFA47D" />
          </g>
        </svg>
      </div>
    );
  }

  if (character === 'junior') {
    return (
      <div
        className="relative inline-flex flex-col items-center cursor-pointer group select-none pointer-events-auto"
        onClick={handleClick}
      >
        {quote && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 animate-in fade-in zoom-in-95 duration-200 pointer-events-none whitespace-nowrap">
            <div className="bg-[#202F36] border-2 border-[#37464F] text-[#F1F7FB] font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5">
              <span>{quote}</span>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#202F36] border-b-2 border-r-2 border-[#37464F] rotate-45" />
            </div>
          </div>
        )}

        <svg
          viewBox="0 0 100 120"
          fill="none"
          className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${clicked ? 'scale-95' : ''} ${className}`}
        >
          {/* Ground Shadow */}
          <ellipse cx="50" cy="114" rx="28" ry="6" fill="#000000" className="animate-shadow-pulse" />

          {/* Animated Body & Cap */}
          <g className="animate-junior-bounce">
            {/* Body */}
            <path d="M34 76 Q50 88 66 76 L74 110 L26 110 Z" fill="#1CB0F6" />

            {/* Face */}
            <circle cx="50" cy="52" r="26" fill="#FFDCB2" />

            {/* Hair */}
            <path d="M24 40 C24 50 30 54 30 54" stroke="#5C3317" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M76 40 C76 50 70 54 70 54" stroke="#5C3317" strokeWidth="4.5" strokeLinecap="round" />

            {/* Blinking Eyes */}
            <g className="animate-eye-blink">
              <circle cx="42" cy="50" r="4" fill="#3C3C3C" />
              <circle cx="43" cy="49" r="1.5" fill="#FFFFFF" />
              <circle cx="58" cy="50" r="4" fill="#3C3C3C" />
              <circle cx="59" cy="49" r="1.5" fill="#FFFFFF" />
            </g>

            {/* Cheerful Smile */}
            <path d="M42 62 Q50 72 58 62" stroke="#D92222" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Rosy Cheeks */}
            <ellipse cx="34" cy="56" rx="4" ry="2.5" fill="#FF9E9E" opacity="0.6" />
            <ellipse cx="66" cy="56" rx="4" ry="2.5" fill="#FF9E9E" opacity="0.6" />

            {/* Wiggling Red Baseball Cap */}
            <g className="animate-junior-cap">
              <path d="M26 36 C26 18 74 18 74 36 Z" fill="#FF4B4B" />
              <ellipse cx="76" cy="36" rx="16" ry="5" fill="#D92222" />
            </g>
          </g>
        </svg>
      </div>
    );
  }

  if (character === 'bea') {
    return (
      <div
        className="relative inline-flex flex-col items-center cursor-pointer group select-none pointer-events-auto"
        onClick={handleClick}
      >
        {quote && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 animate-in fade-in zoom-in-95 duration-200 pointer-events-none whitespace-nowrap">
            <div className="bg-[#202F36] border-2 border-[#37464F] text-[#F1F7FB] font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5">
              <span>{quote}</span>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#202F36] border-b-2 border-r-2 border-[#37464F] rotate-45" />
            </div>
          </div>
        )}

        <svg
          viewBox="0 0 100 120"
          fill="none"
          className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${clicked ? 'scale-95' : ''} ${className}`}
        >
          <ellipse cx="50" cy="114" rx="28" ry="6" fill="#000000" className="animate-shadow-pulse" />

          <g className="animate-duo-bob">
            <circle cx="50" cy="44" r="30" fill="#CE82FF" />
            <circle cx="50" cy="52" r="24" fill="#FFE0BD" />

            {/* Glasses */}
            <circle cx="40" cy="52" r="8.5" stroke="#3C3C3C" strokeWidth="3" fill="rgba(255,255,255,0.4)" />
            <circle cx="60" cy="52" r="8.5" stroke="#3C3C3C" strokeWidth="3" fill="rgba(255,255,255,0.4)" />
            <line x1="48.5" y1="52" x2="51.5" y2="52" stroke="#3C3C3C" strokeWidth="3" />

            <g className="animate-eye-blink">
              <circle cx="40" cy="52" r="3" fill="#3C3C3C" />
              <circle cx="60" cy="52" r="3" fill="#3C3C3C" />
            </g>

            <path d="M44 65 Q50 70 56 65" stroke="#4B4B4B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M34 76 Q50 88 66 76 L74 110 L26 110 Z" fill="#FFC800" />
          </g>
        </svg>
      </div>
    );
  }

  // Fallback: Lin
  return (
    <svg viewBox="0 0 100 120" fill="none" className={`shrink-0 select-none animate-duo-bob ${className}`}>
      <ellipse cx="50" cy="114" rx="28" ry="6" fill="#000000" opacity="0.25" />
      <circle cx="50" cy="48" r="30" fill="#777777" />
      <circle cx="50" cy="52" r="24" fill="#E8C39E" />
      <path d="M28 40 C30 26 70 24 72 40 C68 34 38 34 28 40 Z" fill="#2B2B2B" />
      <line x1="37" y1="50" x2="45" y2="50" stroke="#2B2B2B" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="55" y1="50" x2="63" y2="50" stroke="#2B2B2B" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M46 64 Q54 66 58 62" stroke="#2B2B2B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M32 76 Q50 88 68 76 L74 110 L26 110 Z" fill="#4B4B4B" />
    </svg>
  );
}
