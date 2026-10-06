import React from 'react';

export type OwlExpression = 'happy' | 'celebrating' | 'thinking' | 'worried' | 'sad' | 'sleeping';

export function OwlMascot({
  expression = 'happy',
  className = 'w-32 h-32',
}: {
  expression?: OwlExpression;
  className?: string;
}) {
  const id = React.useId();

  return (
    <svg viewBox="0 0 120 120" fill="none" className={className}>
      <defs>
        {/* Body 3D Gradient */}
        <linearGradient id={`owl-body-${id}`} x1="60" y1="12" x2="60" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67DF0A" />
          <stop offset="70%" stopColor="#58CC02" />
          <stop offset="100%" stopColor="#46A800" />
        </linearGradient>
        {/* Belly Gradient */}
        <linearGradient id={`owl-belly-${id}`} x1="60" y1="58" x2="60" y2="102" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A4F138" />
          <stop offset="100%" stopColor="#87E019" />
        </linearGradient>
        {/* Beak Gradient */}
        <linearGradient id={`owl-beak-${id}`} x1="60" y1="58" x2="60" y2="76" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFA61A" />
          <stop offset="100%" stopColor="#E67E00" />
        </linearGradient>
        {/* Feet Gradient */}
        <linearGradient id={`owl-foot-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB326" />
          <stop offset="100%" stopColor="#DE7B00" />
        </linearGradient>
        {/* Drop shadow filter */}
        <filter id={`owl-shadow-${id}`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="2.5" floodColor="#2E6E00" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* 1. Feet */}
      <g>
        <ellipse cx="46" cy="107" rx="9" ry="5.5" fill={`url(#owl-foot-${id})`} />
        <ellipse cx="74" cy="107" rx="9" ry="5.5" fill={`url(#owl-foot-${id})`} />
      </g>

      {/* Main Animated Duo Body */}
      <g className={expression === 'sleeping' ? '' : 'animate-duo-bob'}>
        {/* 2. Main Body with 3D drop shadow */}
        <rect
          x="22"
          y="16"
          width="76"
          height="88"
          rx="38"
          fill={`url(#owl-body-${id})`}
          filter={`url(#owl-shadow-${id})`}
        />

        {/* 3. Ear Tufts */}
        <path d="M26 30 C20 18 30 12 40 20 Z" fill="#58CC02" />
        <path d="M94 30 C100 18 90 12 80 20 Z" fill="#58CC02" />

        {/* 4. Wings */}
        {expression === 'celebrating' ? (
          <g className="animate-owl-wing">
            {/* Wings High in Celebration */}
            <path
              d="M24 55 C10 32 18 18 32 30 C30 45 28 55 24 55 Z"
              fill="#4AA800"
              stroke="#3B8E00"
              strokeWidth="1.5"
            />
            <path
              d="M96 55 C110 32 102 18 88 30 C90 45 92 55 96 55 Z"
              fill="#4AA800"
              stroke="#3B8E00"
              strokeWidth="1.5"
            />
          </g>
        ) : expression === 'sad' ? (
          <>
            {/* Wings Drooping */}
            <path
              d="M23 55 C18 70 20 88 28 84 C30 76 30 62 23 55 Z"
              fill="#4AA800"
              stroke="#3B8E00"
              strokeWidth="1.5"
            />
            <path
              d="M97 55 C102 70 100 88 92 84 C90 76 90 62 97 55 Z"
              fill="#4AA800"
              stroke="#3B8E00"
              strokeWidth="1.5"
            />
          </>
        ) : (
          <g className="animate-owl-wing">
            {/* Resting / Flapping Wings */}
            <path
              d="M23 48 C15 62 18 80 27 75 C30 68 30 55 23 48 Z"
              fill="#4AA800"
              stroke="#3B8E00"
              strokeWidth="1.5"
            />
            <path
              d="M97 48 C105 62 102 80 93 75 C90 68 90 55 97 48 Z"
              fill="#4AA800"
              stroke="#3B8E00"
              strokeWidth="1.5"
            />
          </g>
        )}

        {/* 5. Belly Pattern */}
        <path
          d="M36 68 C36 94 84 94 84 68 C72 58 48 58 36 68 Z"
          fill={`url(#owl-belly-${id})`}
        />
        {/* Belly feather texture scallops */}
        <path d="M50 77 Q60 84 70 77" stroke="#68C50C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M44 87 Q60 96 76 87" stroke="#68C50C" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* 6. Big Eyes (White Rings) with Blinking */}
        <g className={expression === 'sleeping' ? '' : 'animate-eye-blink'}>
          <circle cx="43" cy="46" r="17" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="1" />
          <circle cx="77" cy="46" r="17" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="1" />

          {/* 7. Expression-Specific Pupils & Face Details */}
          {expression === 'sleeping' ? (
            <>
              <path d="M33 48 Q43 57 53 48" stroke="#3C3C3C" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M67 48 Q77 57 87 48" stroke="#3C3C3C" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Floating Zzz */}
              <text x="88" y="26" fill="#1CB0F6" fontSize="13" fontWeight="900" fontFamily="sans-serif">
                z
              </text>
              <text x="96" y="16" fill="#1CB0F6" fontSize="16" fontWeight="900" fontFamily="sans-serif">
                Z
              </text>
            </>
          ) : expression === 'sad' ? (
            <>
              <circle cx="43" cy="48" r="8.5" fill="#3C3C3C" />
              <circle cx="77" cy="48" r="8.5" fill="#3C3C3C" />
              <circle cx="41" cy="45" r="2.8" fill="#FFFFFF" />
              <circle cx="75" cy="45" r="2.8" fill="#FFFFFF" />
              {/* Tear */}
              <path d="M36 57 C33 63 39 67 39 64 C39 61 36 57 36 57 Z" fill="#1CB0F6" />
            </>
          ) : expression === 'worried' ? (
            <>
              <circle cx="43" cy="46" r="7.5" fill="#3C3C3C" />
              <circle cx="77" cy="46" r="7.5" fill="#3C3C3C" />
              <circle cx="45" cy="44" r="2.5" fill="#FFFFFF" />
              <circle cx="79" cy="44" r="2.5" fill="#FFFFFF" />
              {/* Angled worried eyebrows */}
              <path d="M32 30 L48 37" stroke="#3C3C3C" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M88 30 L72 37" stroke="#3C3C3C" strokeWidth="3.5" strokeLinecap="round" />
            </>
          ) : expression === 'thinking' ? (
            <g className="animate-pupil-glance">
              {/* Looking up & to the right */}
              <circle cx="46" cy="42" r="8.5" fill="#3C3C3C" />
              <circle cx="80" cy="42" r="8.5" fill="#3C3C3C" />
              <circle cx="49" cy="39" r="3" fill="#FFFFFF" />
              <circle cx="83" cy="39" r="3" fill="#FFFFFF" />
              {/* One raised eyebrow */}
              <path d="M33 34 Q43 28 51 34" stroke="#3C3C3C" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M69 30 Q77 22 85 30" stroke="#3C3C3C" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            /* Happy & Celebrating */
            <g className="animate-pupil-glance">
              <circle cx="43" cy="46" r="9.5" fill="#3C3C3C" />
              <circle cx="77" cy="46" r="9.5" fill="#3C3C3C" />
              {/* Dual eye sparkle reflections */}
              <circle cx="46" cy="43" r="3.5" fill="#FFFFFF" />
              <circle cx="41" cy="48" r="1.5" fill="#FFFFFF" />
              <circle cx="80" cy="43" r="3.5" fill="#FFFFFF" />
              <circle cx="75" cy="48" r="1.5" fill="#FFFFFF" />
              {/* Cheerful blush on cheeks */}
              <ellipse cx="28" cy="54" rx="4" ry="2.5" fill="#FF8BA7" opacity="0.4" />
              <ellipse cx="92" cy="54" rx="4" ry="2.5" fill="#FF8BA7" opacity="0.4" />
            </g>
          )}
        </g>

        {/* 8. Chunky 3D Beak */}
        <polygon
          points="60,54 50,68 70,68"
          fill={`url(#owl-beak-${id})`}
          stroke="#CC7000"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <polygon
          points="60,65 54,71 66,71"
          fill="#CC7000"
        />
      </g>
    </svg>
  );
}
