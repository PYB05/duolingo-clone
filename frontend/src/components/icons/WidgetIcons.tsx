import React from 'react';

export function SuperBadge({ className = 'h-6' }: { className?: string }) {
  // Iridescent green-to-pink holographic SUPER badge matching screenshot
  return (
    <svg viewBox="0 0 88 28" fill="none" className={`shrink-0 select-none ${className}`}>
      <defs>
        <linearGradient id="super-pill" x1="0" y1="0" x2="88" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2CE880" />
          <stop offset="35%" stopColor="#1CB0F6" />
          <stop offset="70%" stopColor="#CE82FF" />
          <stop offset="100%" stopColor="#FF4BD8" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="88" height="28" rx="7" fill="url(#super-pill)" />
      <text
        x="44"
        y="20"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="15"
        fontWeight="900"
        fontStyle="italic"
        fontFamily="sans-serif"
        letterSpacing="1.5"
      >
        SUPER
      </text>
    </svg>
  );
}

export function SuperFlyingDuo({ className = 'w-24 h-24' }: { className?: string }) {
  // Cosmic Iridescent Flying Duo with neon pink legs and glowing wings (matching user screenshot 2)
  return (
    <svg viewBox="0 0 140 120" fill="none" className={`shrink-0 select-none ${className}`}>
      <defs>
        <linearGradient id="duo-super-body-grad" x1="15" y1="15" x2="125" y2="105" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2CE880" />
          <stop offset="30%" stopColor="#1CB0F6" />
          <stop offset="70%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        <linearGradient id="duo-super-wing-grad" x1="85" y1="20" x2="135" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
      </defs>

      {/* Neon Pink Trailing Feet */}
      <ellipse cx="106" cy="94" rx="7.5" ry="4" fill="#FF1493" transform="rotate(-15 106 94)" />
      <ellipse cx="120" cy="88" rx="6.5" ry="3.5" fill="#FF1493" transform="rotate(-15 120 88)" />

      {/* Lifted Right Wing */}
      <path
        d="M85 45 C95 20 125 25 132 48 C135 60 120 75 100 70 Z"
        fill="url(#duo-super-wing-grad)"
        opacity="0.95"
      />

      {/* Main Oval Flying Body */}
      <ellipse cx="65" cy="62" rx="42" ry="34" fill="url(#duo-super-body-grad)" transform="rotate(-10 65 62)" />

      {/* Feather Belly Scales */}
      <path d="M52 75 Q60 82 68 75" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M68 75 Q76 82 84 75" stroke="#818CF8" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M60 84 Q68 91 76 84" stroke="#C084FC" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Ear Tuft Feathers */}
      <path d="M38 32 C34 22 46 20 50 28 Z" fill="#2CE880" />
      <path d="M72 26 C75 16 88 18 86 26 Z" fill="#1CB0F6" />

      {/* Cute Open Eyes */}
      <ellipse cx="44" cy="50" rx="9" ry="12" fill="#22D3EE" opacity="0.3" />
      <ellipse cx="44" cy="50" rx="7" ry="9" stroke="#0284C7" strokeWidth="2.5" fill="#E0F2FE" />
      <circle cx="44" cy="50" r="3.5" fill="#0369A1" />

      <ellipse cx="72" cy="46" rx="9" ry="12" fill="#818CF8" opacity="0.3" />
      <ellipse cx="72" cy="46" rx="7" ry="9" stroke="#4338CA" strokeWidth="2.5" fill="#E0E7FF" />
      <circle cx="72" cy="46" r="3.5" fill="#3730A3" />

      {/* Cute Open Beak */}
      <path d="M54 52 Q58 64 62 52 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
    </svg>
  );
}

export function SapphireHexBadge({ className = 'w-20 h-20' }: { className?: string }) {
  // Sapphire hexagonal league promotion badge with centered quill feather (matching screenshot)
  return (
    <svg viewBox="0 0 100 110" fill="none" className={`shrink-0 select-none ${className}`}>
      <defs>
        <linearGradient id="sapphire-facet" x1="10" y1="10" x2="90" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="60%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
      </defs>

      {/* Outer Hexagon Shadow Plate */}
      <polygon points="50,4 94,27 94,77 50,100 6,77 6,27" fill="#0C4A6E" />
      <polygon points="50,2 96,26 96,74 50,98 4,74 4,26" fill="#0284C7" />

      {/* Inner Raised 3D Hexagon */}
      <polygon points="50,8 90,29 90,73 50,94 10,73 10,29" fill="url(#sapphire-facet)" />

      {/* Inner Light Bevel Border */}
      <polygon
        points="50,14 84,32 84,70 50,88 16,70 16,32"
        stroke="#7DD3FC"
        strokeWidth="3.5"
        strokeLinejoin="round"
        fill="#0EA5E9"
        fillOpacity="0.4"
      />

      {/* Centered Stylized Feather */}
      <path
        d="M62 32 C62 32 38 38 34 62 C34 66 38 68 42 66 C44 64 48 58 48 58 L46 64 C48 64 54 58 56 52 C58 46 62 32 62 32 Z"
        fill="#0284C7"
        stroke="#0369A1"
        strokeWidth="2"
      />
      <line x1="34" y1="72" x2="56" y2="40" stroke="#082F49" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function QuestMiniChest({ className = 'w-7 h-7' }: { className?: string }) {
  // Mini wooden chest icon sitting at the end of quest progress bar (matching user screenshot 2)
  return (
    <svg viewBox="0 0 32 32" fill="none" className={`shrink-0 select-none ${className}`}>
      <rect x="3" y="11" width="26" height="17" rx="3" fill="#92400E" />
      <rect x="4" y="12" width="24" height="14" rx="2" fill="#D97706" />
      <rect x="3" y="8" width="26" height="6" rx="2.5" fill="#F59E0B" />
      <rect x="13" y="11" width="6" height="9" rx="1.5" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
      <circle cx="16" cy="14" r="1.2" fill="#78350F" />
      <rect x="15.4" y="14" width="1.2" height="3" fill="#78350F" />
    </svg>
  );
}
