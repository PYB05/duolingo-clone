import React from 'react';

export function HouseIcon({ className = 'w-7 h-7' }: { className?: string }) {
  // Red roof, yellow front, circular entrance hole (Duolingo Learn Home icon)
  return (
    <svg viewBox="0 0 32 32" fill="none" className={`shrink-0 select-none ${className}`}>
      {/* Yellow Birdhouse Box */}
      <rect x="7" y="13" width="18" height="15" rx="3" fill="#FFC800" stroke="#E5B400" strokeWidth="1.2" />
      <rect x="9" y="15" width="14" height="11" rx="1.5" fill="#FFD54F" />

      {/* Red Triangular Roof with 3D Overhang */}
      <path d="M16 3 L3 14 L7 15 L16 7 L25 15 L29 14 Z" fill="#FF4B4B" stroke="#D92222" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M16 6 L6 14.5 L16 8 L26 14.5 Z" fill="#FF6B6B" />

      {/* Birdhouse Entry Hole */}
      <circle cx="16" cy="19" r="3.2" fill="#583500" stroke="#3D2400" strokeWidth="1" />
      <circle cx="16" cy="18.5" r="2.2" fill="#291800" />

      {/* Wooden Perch Peg */}
      <rect x="14.5" y="23" width="3" height="2" rx="1" fill="#FF9600" />
    </svg>
  );
}

export function DumbbellIcon({ className = 'w-7 h-7' }: { className?: string }) {
  // Dual-tone blue dumbbell with red/orange accent weight
  return (
    <svg viewBox="0 0 32 32" fill="none" className={`shrink-0 select-none ${className}`}>
      {/* Angled Bar */}
      <line x1="10" y1="22" x2="22" y2="10" stroke="#1899D6" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="10" y1="22" x2="22" y2="10" stroke="#1CB0F6" strokeWidth="3" strokeLinecap="round" />

      {/* Left Double Hex Plates */}
      <g transform="translate(6, 18) rotate(-45)">
        <rect x="-3" y="-7" width="5" height="14" rx="2" fill="#1CB0F6" stroke="#1899D6" strokeWidth="1" />
        <rect x="-7" y="-9" width="5" height="18" rx="2.5" fill="#1CB0F6" stroke="#147BAA" strokeWidth="1" />
      </g>

      {/* Right Double Hex Plates with Red Accent */}
      <g transform="translate(24, 10) rotate(-45)">
        <rect x="-2" y="-7" width="5" height="14" rx="2" fill="#1CB0F6" stroke="#1899D6" strokeWidth="1" />
        <rect x="2" y="-9" width="5" height="18" rx="2.5" fill="#1CB0F6" stroke="#147BAA" strokeWidth="1" />
        <circle cx="5" cy="-7" r="3" fill="#FF4B4B" />
      </g>
    </svg>
  );
}

export function DuolingoShieldIcon({ className = 'w-7 h-7' }: { className?: string }) {
  // Golden yellow badge shield with 3D bevel (matching screenshot 1)
  return (
    <svg viewBox="0 0 32 32" fill="none" className={`shrink-0 select-none ${className}`}>
      <path
        d="M16 2.5 C19 5.5 24 6 27 6.5 C27 16 23 24 16 29.5 C9 24 5 16 5 6.5 C8 6 13 5.5 16 2.5 Z"
        fill="#FFC800"
        stroke="#E5B400"
        strokeWidth="1.5"
      />
      {/* Right Side Shadow Bevel */}
      <path
        d="M16 2.5 C19 5.5 24 6 27 6.5 C27 16 23 24 16 29.5 L16 2.5 Z"
        fill="#E5B400"
        opacity="0.5"
      />
      {/* Top Specular Glint */}
      <path
        d="M16 5 C14 6.8 10 7.2 8 7.5 C8 14 11 19 16 24"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        opacity="0.45"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DuolingoChestNavIcon({ className = 'w-7 h-7' }: { className?: string }) {
  // Golden chest nav icon (matching screenshot 1)
  return (
    <svg viewBox="0 0 32 32" fill="none" className={`shrink-0 select-none ${className}`}>
      {/* Main Chest Body */}
      <rect x="4" y="10" width="24" height="17" rx="3" fill="#E59400" stroke="#B45309" strokeWidth="1" />
      <rect x="6" y="12" width="20" height="13" rx="2" fill="#FFC800" />
      {/* Side Bands */}
      <rect x="4" y="10" width="4" height="17" rx="1.5" fill="#FBBF24" />
      <rect x="24" y="10" width="4" height="17" rx="1.5" fill="#D97706" />
      {/* Dome Lid */}
      <path d="M4 10 C4 6 8 4 16 4 C24 4 28 6 28 10 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
      {/* Center Lock Hardware */}
      <circle cx="16" cy="16" r="3.2" fill="#FFD54F" stroke="#B45309" strokeWidth="1" />
      <rect x="15" y="17" width="2" height="3" fill="#78350F" />
    </svg>
  );
}

export function DuolingoShopNavIcon({ className = 'w-7 h-7' }: { className?: string }) {
  // Red & White Striped Awning Storefront (matching screenshot 1)
  return (
    <svg viewBox="0 0 32 32" fill="none" className={`shrink-0 select-none ${className}`}>
      {/* Store Building Base */}
      <rect x="5" y="14" width="22" height="14" rx="2" fill="#607D8B" stroke="#455A64" strokeWidth="1" />
      <rect x="8" y="19" width="7" height="9" rx="1" fill="#80DEEA" />
      <rect x="18" y="19" width="6" height="9" rx="1" fill="#455A64" />

      {/* Red & White Striped Canopy / Awning */}
      <path d="M4 8 L28 8 L27 15 L5 15 Z" fill="#FF4B4B" />
      {/* White Stripes */}
      <polygon points="9,8 14,8 13,15 8,15" fill="#FFFFFF" />
      <polygon points="18,8 23,8 22,15 17,15" fill="#FFFFFF" />
      {/* Scalloped Bottom Edge */}
      <path d="M4 15 Q6.5 17 9 15 Q11.5 17 14 15 Q16.5 17 19 15 Q21.5 17 24 15 Q26.5 17 28 15" stroke="#D32F2F" strokeWidth="1" fill="none" />
    </svg>
  );
}

export function DuolingoProfileNavIcon({ className = 'w-7 h-7', initial = 'J' }: { className?: string; initial?: string }) {
  // Dashed Circle with User Initial (matching screenshot 1)
  return (
    <svg viewBox="0 0 32 32" fill="none" className={`shrink-0 select-none ${className}`}>
      {/* Dashed outer ring */}
      <circle
        cx="16"
        cy="16"
        r="13"
        stroke="#52656D"
        strokeWidth="2.2"
        strokeDasharray="4.5 3"
        fill="#202F36"
      />
      {/* Centered Initial */}
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fill="#829BA8"
        fontSize="14"
        fontWeight="900"
        fontFamily="sans-serif"
      >
        {initial}
      </text>
    </svg>
  );
}

export function DuolingoMoreNavIcon({ className = 'w-7 h-7' }: { className?: string }) {
  // Purple circle with 3 white horizontal dots (matching screenshot 1)
  return (
    <svg viewBox="0 0 32 32" fill="none" className={`shrink-0 select-none ${className}`}>
      <circle cx="16" cy="16" r="14" fill="#CE82FF" />
      <circle cx="16" cy="16" r="13" fill="#B866FF" />
      {/* Three White Dots */}
      <circle cx="10.5" cy="16" r="1.8" fill="#FFFFFF" />
      <circle cx="16" cy="16" r="1.8" fill="#FFFFFF" />
      <circle cx="21.5" cy="16" r="1.8" fill="#FFFFFF" />
    </svg>
  );
}

export function DuolingoGearIcon({ className = 'w-7 h-7' }: { className?: string }) {
  // Authentic 3D Duolingo Mechanical Gear / Settings Cog
  return (
    <svg viewBox="0 0 32 32" fill="none" className={`shrink-0 select-none ${className}`}>
      <defs>
        <linearGradient id="gear-body" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#AFAFAF" />
          <stop offset="50%" stopColor="#829BA8" />
          <stop offset="100%" stopColor="#52656D" />
        </linearGradient>
      </defs>

      {/* 3D Drop-Shadow Bevel */}
      <circle cx="16" cy="17.5" r="12" fill="#202F36" />
      <circle cx="16" cy="16.8" r="12" fill="#37464F" />

      {/* 8 Outer Cog Teeth */}
      <g stroke="#37464F" strokeWidth="1.5" strokeLinejoin="round">
        {/* Top & Bottom Teeth */}
        <rect x="13" y="1" width="6" height="5" rx="1.5" fill="#AFAFAF" />
        <rect x="13" y="26" width="6" height="5" rx="1.5" fill="#6B7D86" />

        {/* Left & Right Teeth */}
        <rect x="1" y="13" width="5" height="6" rx="1.5" fill="#8FA4AF" />
        <rect x="26" y="13" width="5" height="6" rx="1.5" fill="#8FA4AF" />

        {/* Diagonal 45 deg Teeth */}
        <rect x="4.5" y="4.5" width="5.5" height="5.5" rx="1.5" fill="#A4B8C3" transform="rotate(45 7.25 7.25)" />
        <rect x="22" y="4.5" width="5.5" height="5.5" rx="1.5" fill="#9CB0BC" transform="rotate(45 24.75 7.25)" />
        <rect x="4.5" y="22" width="5.5" height="5.5" rx="1.5" fill="#758893" transform="rotate(45 7.25 24.75)" />
        <rect x="22" y="22" width="5.5" height="5.5" rx="1.5" fill="#6B7D86" transform="rotate(45 24.75 24.75)" />
      </g>

      {/* Main Center Disc */}
      <circle cx="16" cy="16" r="10.5" fill="url(#gear-body)" stroke="#37464F" strokeWidth="1.5" />

      {/* Inner Raised Ring */}
      <circle cx="16" cy="15.5" r="6.5" fill="#DCE6EC" stroke="#37464F" strokeWidth="1.2" />

      {/* Center Axle Recess */}
      <circle cx="16" cy="15.5" r="3.2" fill="#202F36" />
      <circle cx="16" cy="15.5" r="2.2" fill="#131F24" />

      {/* Specular Highlight Arc */}
      <path
        d="M9 14 C10 9 14 7 18 7"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
