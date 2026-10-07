import React from 'react';

export function GemIcon({ className = 'w-6 h-6' }: { className?: string }) {
  // Exact Duolingo 3D Hexagonal Gem (Gems/Lingots) matching screenshot
  return (
    <svg viewBox="0 0 32 32" fill="none" className={`shrink-0 select-none ${className}`}>
      {/* 3D Bottom/Under Bevel */}
      <polygon
        points="16,2 29,8.5 29,23.5 16,30 3,23.5 3,8.5"
        fill="#0284C7"
      />

      {/* Main Hexagon Face */}
      <polygon
        points="16,3 27.5,9 27.5,23 16,29 4.5,23 4.5,9"
        fill="#1CB0F6"
      />

      {/* Top Left Highlight Facet */}
      <polygon
        points="16,3 27.5,9 16,13 4.5,9"
        fill="#79E2FB"
      />

      {/* Inner Central Bevel/Cutout Hexagon */}
      <polygon
        points="16,7 23.5,11 23.5,21 16,25 8.5,21 8.5,11"
        fill="#0284C7"
      />

      {/* Center Crystal Core Flat Bright Face */}
      <polygon
        points="16,9 21.5,12 21.5,20 16,23 10.5,20 10.5,12"
        fill="#1CB0F6"
      />

      {/* Pure White Glint at Top */}
      <polygon
        points="16,3 20,5 16,7 12,5"
        fill="#FFFFFF"
        opacity="0.9"
      />
    </svg>
  );
}

export function BoltIcon({ className = 'w-6 h-6' }: { className?: string }) {
  // Exact Duolingo Golden 4-point energy/lightning star matching Daily Quests screenshot
  return (
    <svg viewBox="0 0 32 32" fill="none" className={`shrink-0 select-none ${className}`}>
      {/* 3D Dark Gold Under Bevel */}
      <path
        d="M16 2.5 L19.8 11.2 L28.8 14.5 L20.5 19.8 L18.8 29.5 L12.5 22.2 L3.2 20.8 L10.8 14.2 Z"
        fill="#D97706"
      />
      <path
        d="M16 1.5 L19.8 10.5 L28.8 13.8 L20.5 19.2 L18.8 28.5 L12.5 21.2 L3.2 19.8 L10.8 13.5 Z"
        fill="#E59400"
      />

      {/* Main Chunky Yellow Energy Star Face */}
      <path
        d="M16 0.5 L19.5 9.5 L28.5 12.8 L20.2 18.2 L18.5 27.5 L12.2 20.2 L3 18.8 L10.5 12.5 Z"
        fill="#FFC800"
      />

      {/* Top Bright Glow / Highlight */}
      <path
        d="M16 0.5 L19.5 9.5 L12.2 20.2 L10.5 12.5 Z"
        fill="#FFDE00"
      />

      {/* Pure White Specular Glint */}
      <circle cx="15" cy="6" r="1.8" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

export function StarIcon({ className = 'w-6 h-6', fill = '#FFFFFF' }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill={fill} className={`shrink-0 ${className}`}>
      <path d="M12 2.2L14.9 8.5L21.8 9.5L16.8 14.3L18 21.2L12 18L6 21.2L7.2 14.3L2.2 9.5L9.1 8.5L12 2.2Z" />
    </svg>
  );
}

export function CheckIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
      <path d="M5 13L9.5 17.5L19 7" />
    </svg>
  );
}

export function HeadphonesIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" fill="currentColor" />
    </svg>
  );
}

export function FlameIcon({ className = 'w-6 h-6', active = true }: { className?: string; active?: boolean }) {
  const id = React.useId();

  if (!active) {
    return (
      <svg viewBox="0 0 32 32" fill="none" className={`shrink-0 ${className}`}>
        <path
          d="M16 29C10.2 29 5.5 24.2 5.5 17.8C5.5 12.2 9 8.8 12.2 6.2C13.2 9.5 15.2 10.5 17.2 2.8C22.2 7.8 26.5 12.8 26.5 17.8C26.5 24.2 21.8 29 16 29Z"
          fill="#AFAFAF"
        />
        <path
          d="M16 26C12.5 26 9.5 22.5 9.5 17.8C9.5 13.8 12 11.2 14.2 9.2C14.8 11.5 16.2 12.5 17.2 6.8C20.5 10.2 22.5 13.8 22.5 17.8C22.5 22.5 19.5 26 16 26Z"
          fill="#D6D6D6"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" fill="none" className={`shrink-0 animate-flame ${className}`}>
      <defs>
        <linearGradient id={`flame-outer-${id}`} x1="16" y1="2" x2="16" y2="29" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF521A" />
          <stop offset="35%" stopColor="#FF7A00" />
          <stop offset="75%" stopColor="#FF9600" />
          <stop offset="100%" stopColor="#E03800" />
        </linearGradient>
        <linearGradient id={`flame-inner-${id}`} x1="16" y1="7" x2="16" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF9A6" />
          <stop offset="30%" stopColor="#FFEB3B" />
          <stop offset="70%" stopColor="#FFC800" />
          <stop offset="100%" stopColor="#FF9600" />
        </linearGradient>
        <filter id={`flame-glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="1.8" floodColor="#C73800" floodOpacity="0.45" />
        </filter>
      </defs>
      <path
        d="M16 29C10.2 29 5.5 24.2 5.5 17.8C5.5 12.2 9 8.8 12.2 6.2C13.2 9.5 15.2 10.5 17.2 2.8C22.2 7.8 26.5 12.8 26.5 17.8C26.5 24.2 21.8 29 16 29Z"
        fill={`url(#flame-outer-${id})`}
        filter={`url(#flame-glow-${id})`}
      />
      <path
        className="animate-flame-inner"
        d="M16 26C12.5 26 9.5 22.5 9.5 17.8C9.5 13.8 12 11.2 14.2 9.2C14.8 11.5 16.2 12.5 17.2 6.8C20.5 10.2 22.5 13.8 22.5 17.8C22.5 22.5 19.5 26 16 26Z"
        fill={`url(#flame-inner-${id})`}
      />
      <ellipse cx="16" cy="20" rx="2.5" ry="4" fill="#FFFFFF" opacity="0.65" />
    </svg>
  );
}

export function HeartIcon({ className = 'w-6 h-6', active = true }: { className?: string; active?: boolean }) {
  const id = React.useId();

  if (!active) {
    return (
      <svg viewBox="0 0 32 32" fill="none" className={`shrink-0 ${className}`}>
        <path
          d="M16 27L13.8 24.9C7.2 19 3 15.2 3 10.5C3 6.6 6.2 3.5 10.2 3.5C12.5 3.5 14.7 4.6 16 6.3C17.3 4.6 19.5 3.5 21.8 3.5C25.8 3.5 29 6.6 29 10.5C29 15.2 24.8 19 18.2 24.9L16 27Z"
          fill="#AFAFAF"
        />
        <path
          d="M16 24.5L14.2 22.8C8.8 17.8 5.2 14.5 5.2 10.9C5.2 7.8 7.6 5.4 10.8 5.4C12.8 5.4 14.6 6.3 16 7.8C17.4 6.3 19.2 5.4 21.2 5.4C24.4 5.4 26.8 7.8 26.8 10.9C26.8 14.5 23.2 17.8 17.8 22.8L16 24.5Z"
          fill="#D6D6D6"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" fill="none" className={`shrink-0 animate-heart-pulse ${className}`}>
      <defs>
        <linearGradient id={`heart-grad-${id}`} x1="16" y1="3.5" x2="16" y2="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF6666" />
          <stop offset="50%" stopColor="#FF4B4B" />
          <stop offset="100%" stopColor="#D91E1E" />
        </linearGradient>
        <filter id={`heart-shadow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="1.5" floodColor="#B31414" floodOpacity="0.45" />
        </filter>
      </defs>
      <path
        d="M16 27L13.8 24.9C7.2 19 3 15.2 3 10.5C3 6.6 6.2 3.5 10.2 3.5C12.5 3.5 14.7 4.6 16 6.3C17.3 4.6 19.5 3.5 21.8 3.5C25.8 3.5 29 6.6 29 10.5C29 15.2 24.8 19 18.2 24.9L16 27Z"
        fill={`url(#heart-grad-${id})`}
        filter={`url(#heart-shadow-${id})`}
      />
      <path
        d="M9.5 6C7.5 6 5.8 7.7 5.8 10C5.8 11.2 6.5 12.8 8 14.5C8.8 13 10 11.5 11.5 10.8C12.5 10.2 13.5 9.5 14 8C13 6.8 11.3 6 9.5 6Z"
        fill="#FFFFFF"
        opacity="0.5"
      />
    </svg>
  );
}

export function CrownIcon({ className = 'w-6 h-6' }: { className?: string }) {
  const id = React.useId();
  return (
    <svg viewBox="0 0 32 32" fill="none" className={`shrink-0 ${className}`}>
      <defs>
        <linearGradient id={`crown-grad-${id}`} x1="16" y1="5" x2="16" y2="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="50%" stopColor="#FFC800" />
          <stop offset="100%" stopColor="#D99B00" />
        </linearGradient>
        <filter id={`crown-shadow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1" floodColor="#B87700" floodOpacity="0.4" />
        </filter>
      </defs>
      <g filter={`url(#crown-shadow-${id})`}>
        <path
          d="M4 22L2 9L9.5 14L16 5L22.5 14L30 9L28 22H4Z"
          fill={`url(#crown-grad-${id})`}
          stroke="#C78900"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <rect x="3" y="22" width="26" height="4" rx="2" fill="#E59400" stroke="#B87700" strokeWidth="1" />
        <circle cx="16" cy="6" r="2.2" fill="#FF4B4B" stroke="#B31414" strokeWidth="0.8" />
        <circle cx="2.5" cy="10" r="1.8" fill="#1CB0F6" stroke="#0E5E85" strokeWidth="0.8" />
        <circle cx="29.5" cy="10" r="1.8" fill="#1CB0F6" stroke="#0E5E85" strokeWidth="0.8" />
        <circle cx="10" cy="24" r="1.2" fill="#2CE880" />
        <circle cx="16" cy="24" r="1.2" fill="#FF4B4B" />
        <circle cx="22" cy="24" r="1.2" fill="#2CE880" />
      </g>
    </svg>
  );
}

export function ShieldIcon({
  className = 'w-6 h-6',
  color = '#FFC800',
  tier: _tier,
}: {
  className?: string;
  color?: string;
  tier?: number;
}) {
  const id = React.useId();
  return (
    <svg viewBox="0 0 32 32" fill="none" className={`shrink-0 ${className}`}>
      <defs>
        <linearGradient id={`shield-grad-${id}`} x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path
        d="M16 2L5 6V15C5 22.5 9.7 28.2 16 30C22.3 28.2 27 22.5 27 15V6L16 2Z"
        fill={color}
        stroke="#FFFFFF"
        strokeWidth="1.5"
      />
      <path
        d="M16 2L5 6V15C5 22.5 9.7 28.2 16 30C22.3 28.2 27 22.5 27 15V6L16 2Z"
        fill={`url(#shield-grad-${id})`}
      />
      <path
        d="M16 10L17.5 13.5L21.2 14L18.4 16.7L19.1 20.4L16 18.6L12.9 20.4L13.6 16.7L10.8 14L14.5 13.5L16 10Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function ChestIcon({ className = 'w-16 h-16', opened = false }: { className?: string; opened?: boolean }) {
  if (opened) {
    return (
      <svg viewBox="0 0 64 64" fill="none" className={`shrink-0 select-none ${className}`}>
        <rect x="10" y="32" width="44" height="26" rx="5" fill="#E59400" />
        <rect x="12" y="34" width="40" height="22" rx="4" fill="#FFC800" />
        <rect x="10" y="30" width="44" height="6" rx="2" fill="#D97706" />
        <path d="M8 22 L32 8 L56 22 L52 28 L32 16 L12 28 Z" fill="#FBBF24" />
        <circle cx="32" cy="40" r="4" fill="#B45309" />
        <rect x="30.5" y="40" width="3" height="7" fill="#B45309" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 80 80" fill="none" className={`shrink-0 select-none ${className}`}>
      <rect x="18" y="58" width="44" height="12" rx="3" fill="#37464F" />
      <rect x="16" y="66" width="48" height="6" rx="2" fill="#202F36" />
      <rect x="20" y="34" width="40" height="28" rx="4" fill="#B45309" />
      <rect x="22" y="36" width="36" height="24" rx="3" fill="#E59400" />
      <rect x="24" y="38" width="32" height="20" rx="2" fill="#FFC800" />
      <rect x="34" y="34" width="12" height="28" fill="#D97706" />
      <rect x="36" y="34" width="8" height="28" fill="#FBBF24" />
      <path d="M18 36 C18 24 30 18 40 18 C50 18 62 24 62 36 Z" fill="#FBBF24" />
      <path d="M20 36 C20 26 30 20 40 20 C50 20 60 26 60 36 Z" fill="#FFD54F" />
      <path d="M16 34 L64 34 L62 38 L18 38 Z" fill="#D97706" />
      <ellipse cx="40" cy="38" rx="5" ry="5" fill="#D97706" />
      <circle cx="40" cy="37" r="3" fill="#FFE082" />
      <circle cx="40" cy="37" r="1.5" fill="#78350F" />
      <rect x="39.2" y="37" width="1.6" height="3" fill="#78350F" />
    </svg>
  );
}

export function LockIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
      <rect x="5" y="10" width="14" height="11" rx="3" fill="currentColor" opacity="0.6" />
      <path d="M8 10V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

export function CrossIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className={`shrink-0 ${className}`}>
      <path d="M6 18L18 6M6 6L18 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SpeakerIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${className}`}>
      <path d="M3 9V15H7L12 20V4L7 9H3ZM16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.02C15.48 15.29 16.5 13.77 16.5 12ZM14 3.23V5.29C16.89 6.15 19 8.83 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.72 18.01 4.14 14 3.23Z" />
    </svg>
  );
}

export function BookIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${className}`}>
      <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM6 4H11V12L8.5 10.5L6 12V4ZM18 20H6V14H18V20ZM18 12H13V4H18V12Z" />
    </svg>
  );
}

export function TrophyIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`}>
      <path
        d="M19 4H17V3C17 2.45 16.55 2 16 2H8C7.45 2 7 2.45 7 3V4H5C3.9 4 3 4.9 3 6V8C3 10.21 4.79 12 7 12H7.23C7.8 14.3 9.7 16 12 16C14.3 16 16.2 14.3 16.77 12H17C19.21 12 21 10.21 21 8V6C21 4.9 20.1 4 19 4ZM5 8V6H7V10C5.9 10 5 9.1 5 8ZM19 8C19 9.1 18.1 10 17 10V6H19V8ZM12 18C10.9 18 10 18.9 10 20H14C14 18.9 13.1 18 12 18ZM8 21C8 21.55 8.45 22 9 22H15C15.55 22 16 21.55 16 21V20H8V21Z"
        fill="#FFC800"
      />
    </svg>
  );
}

export function TurtleIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${className}`}>
      <path d="M12 4C8.69 4 6 6.69 6 10C6 11.25 6.38 12.42 7.05 13.39L5 15.44L6.41 16.85L8.46 14.8C9.42 15.47 10.66 16 12 16C13.34 16 14.58 15.47 15.54 14.8L17.59 16.85L19 15.44L16.95 13.39C17.62 12.42 18 11.25 18 10C18 6.69 15.31 4 12 4ZM12 14C9.79 14 8 12.21 8 10C8 7.79 9.79 6 12 6C14.21 6 16 7.79 16 10C16 12.21 14.21 14 12 14Z" />
    </svg>
  );
}

export * from './NavIcons';
export * from './WidgetIcons';
export * from './PracticeIcons';
export * from './ExerciseIcons';


