import React from 'react';

/**
 * High-fidelity 3D Duolingo Practice Hub Icons with rich faceted geometry,
 * glossy highlights, metallic specular sheens, and vibrant gem accents.
 */

export function PracticeCrown3D({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`shrink-0 select-none ${className}`}>
      <defs>
        <linearGradient id="crown-gold-main" x1="32" y1="12" x2="32" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF176" />
          <stop offset="35%" stopColor="#FFC800" />
          <stop offset="85%" stopColor="#E59400" />
          <stop offset="100%" stopColor="#B36B00" />
        </linearGradient>
        <linearGradient id="crown-gold-side-l" x1="12" y1="18" x2="28" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#CC7A00" />
        </linearGradient>
        <linearGradient id="crown-gold-side-r" x1="52" y1="18" x2="36" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#A05A00" />
        </linearGradient>
        <linearGradient id="crown-base-rim" x1="32" y1="44" x2="32" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFA000" />
          <stop offset="100%" stopColor="#7F4000" />
        </linearGradient>
        <radialGradient id="crown-ruby" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FF8585" />
          <stop offset="45%" stopColor="#FF4B4B" />
          <stop offset="85%" stopColor="#B80000" />
          <stop offset="100%" stopColor="#660000" />
        </radialGradient>
        <radialGradient id="crown-sapphire" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#90E0EF" />
          <stop offset="45%" stopColor="#1CB0F6" />
          <stop offset="85%" stopColor="#0B729F" />
          <stop offset="100%" stopColor="#043A52" />
        </radialGradient>
        <radialGradient id="crown-emerald" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="45%" stopColor="#58CC02" />
          <stop offset="85%" stopColor="#358000" />
        </radialGradient>
        <filter id="crown-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>

      <g filter="url(#crown-glow)">
        {/* 3D Underlay base shadow */}
        <path d="M6 46L8 20L20 30L32 14L44 30L56 20L58 46L6 46Z" fill="#7F4000" />

        {/* Left Crown Peak & Facet */}
        <path d="M8 21L20 31L18 45L6 45L8 21Z" fill="url(#crown-gold-side-l)" />
        <path d="M8 21L20 31L16 35L10 27Z" fill="#FFF59D" opacity="0.6" />

        {/* Right Crown Peak & Facet */}
        <path d="M56 21L44 31L46 45L58 45L56 21Z" fill="url(#crown-gold-side-r)" />

        {/* Center Main Peak & Facets */}
        <path d="M20 31L32 15L44 31L32 46L20 31Z" fill="url(#crown-gold-main)" />
        {/* Center highlight facet */}
        <path d="M32 15L32 46L20 31L32 15Z" fill="#FFF9C4" opacity="0.35" />

        {/* Inset Crown Base Band with 3D Bevel */}
        <rect x="5" y="44" width="54" height="10" rx="5" fill="url(#crown-base-rim)" />
        <rect x="6" y="44.5" width="52" height="4" rx="2" fill="#FFD54F" opacity="0.5" />
        <rect x="6" y="50" width="52" height="3" rx="1.5" fill="#5C2C00" opacity="0.6" />

        {/* Center Ruby Jewel on Main Peak */}
        <circle cx="32" cy="15" r="5" fill="url(#crown-ruby)" stroke="#4A0000" strokeWidth="0.8" />
        <circle cx="30.5" cy="13.5" r="1.5" fill="#FFFFFF" opacity="0.8" />

        {/* Left Sapphire Jewel */}
        <circle cx="8" cy="21" r="4.2" fill="url(#crown-sapphire)" stroke="#043A52" strokeWidth="0.8" />
        <circle cx="6.8" cy="19.8" r="1.2" fill="#FFFFFF" opacity="0.8" />

        {/* Right Sapphire Jewel */}
        <circle cx="56" cy="21" r="4.2" fill="url(#crown-sapphire)" stroke="#043A52" strokeWidth="0.8" />
        <circle cx="54.8" cy="19.8" r="1.2" fill="#FFFFFF" opacity="0.8" />

        {/* Jewels on Base Band */}
        <circle cx="16" cy="49" r="2.8" fill="url(#crown-emerald)" stroke="#235500" strokeWidth="0.5" />
        <circle cx="15.2" cy="48.2" r="0.8" fill="#FFFFFF" opacity="0.8" />

        <circle cx="32" cy="49" r="3.2" fill="url(#crown-ruby)" stroke="#4A0000" strokeWidth="0.5" />
        <circle cx="31" cy="48" r="0.9" fill="#FFFFFF" opacity="0.8" />

        <circle cx="48" cy="49" r="2.8" fill="url(#crown-emerald)" stroke="#235500" strokeWidth="0.5" />
        <circle cx="47.2" cy="48.2" r="0.8" fill="#FFFFFF" opacity="0.8" />
      </g>
    </svg>
  );
}

export function PracticeHeart3D({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`shrink-0 select-none ${className}`}>
      <defs>
        <linearGradient id="p-heart-base" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF7070" />
          <stop offset="35%" stopColor="#FF4B4B" />
          <stop offset="85%" stopColor="#E51E1E" />
          <stop offset="100%" stopColor="#990000" />
        </linearGradient>
        <filter id="p-heart-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>
      <g filter="url(#p-heart-shadow)">
        {/* 3D Underlay */}
        <path
          d="M32 55L27.6 50.8C14.4 39 6 31.4 6 22C6 14.2 12.4 8 20.4 8C25 8 29.4 10.2 32 13.6C34.6 10.2 39 8 43.6 8C51.6 8 58 14.2 58 22C58 31.4 49.6 39 36.4 50.8L32 55Z"
          fill="#800000"
        />
        {/* Main Heart Face */}
        <path
          d="M32 53L28 49C15.2 37.6 7 30.2 7 21C7 13.5 13.2 7.5 21 7.5C25.4 7.5 29.6 9.6 32 13C34.4 9.6 38.6 7.5 43 7.5C50.8 7.5 57 13.5 57 21C57 30.2 48.8 37.6 36 49L32 53Z"
          fill="url(#p-heart-base)"
        />
        {/* Top-Left Glossy Glass Specular Sheen */}
        <path
          d="M20 12C15.5 12 11.5 15.5 11.5 20.5C11.5 23 13 26 16 29C17.5 26.5 20 23.5 23 22C25 21 27 19.5 28 16C26 13.5 23 12 20 12Z"
          fill="#FFFFFF"
          opacity="0.55"
        />
        <ellipse cx="20" cy="14" rx="4" ry="2" fill="#FFFFFF" opacity="0.8" />
      </g>
    </svg>
  );
}

export function PracticeMistakes3D({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`shrink-0 select-none ${className}`}>
      <defs>
        <linearGradient id="dumbbell-bar" x1="10" y1="32" x2="54" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#829BA8" />
          <stop offset="50%" stopColor="#F1F7FB" />
          <stop offset="100%" stopColor="#52656D" />
        </linearGradient>
        <linearGradient id="dumbbell-weight-l" x1="16" y1="12" x2="16" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#78E020" />
          <stop offset="50%" stopColor="#58CC02" />
          <stop offset="100%" stopColor="#358000" />
        </linearGradient>
        <linearGradient id="dumbbell-weight-r" x1="48" y1="12" x2="48" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#78E020" />
          <stop offset="50%" stopColor="#58CC02" />
          <stop offset="100%" stopColor="#358000" />
        </linearGradient>
        <filter id="p-dumbbell-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>
      <g filter="url(#p-dumbbell-shadow)" transform="rotate(-25 32 32)">
        {/* Center Metal Grip Bar */}
        <rect x="14" y="27" width="36" height="10" rx="3" fill="url(#dumbbell-bar)" stroke="#37464F" strokeWidth="1" />
        <rect x="24" y="28" width="16" height="8" rx="2" fill="#58CC02" opacity="0.35" />

        {/* Left Outer Weight Disk */}
        <rect x="6" y="16" width="6" height="32" rx="3" fill="#2E6600" />
        <rect x="8" y="14" width="6" height="36" rx="3" fill="url(#dumbbell-weight-l)" />
        <rect x="14" y="18" width="5" height="28" rx="2.5" fill="#78E020" />

        {/* Right Outer Weight Disk */}
        <rect x="52" y="16" width="6" height="32" rx="3" fill="#2E6600" />
        <rect x="50" y="14" width="6" height="36" rx="3" fill="url(#dumbbell-weight-r)" />
        <rect x="45" y="18" width="5" height="28" rx="2.5" fill="#78E020" />

        {/* End Caps with Gloss highlights */}
        <ellipse cx="11" cy="20" rx="2" ry="4" fill="#FFFFFF" opacity="0.6" />
        <ellipse cx="53" cy="20" rx="2" ry="4" fill="#FFFFFF" opacity="0.6" />
      </g>
    </svg>
  );
}

export function PracticeSpeed3D({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`shrink-0 select-none ${className}`}>
      <defs>
        <linearGradient id="speed-gold" x1="32" y1="8" x2="32" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF176" />
          <stop offset="35%" stopColor="#FFC800" />
          <stop offset="85%" stopColor="#E59400" />
          <stop offset="100%" stopColor="#A05A00" />
        </linearGradient>
        <linearGradient id="speed-face" x1="32" y1="18" x2="32" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#202F36" />
          <stop offset="100%" stopColor="#131F24" />
        </linearGradient>
        <linearGradient id="speed-bolt" x1="32" y1="20" x2="32" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="40%" stopColor="#FFD600" />
          <stop offset="100%" stopColor="#FF9100" />
        </linearGradient>
        <filter id="p-speed-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>
      <g filter="url(#p-speed-shadow)">
        {/* Top Button / Loop */}
        <rect x="27" y="5" width="10" height="7" rx="3" fill="#A05A00" />
        <rect x="28" y="4" width="8" height="6" rx="2" fill="#FFC800" />
        <circle cx="32" cy="7" r="2.5" fill="#FFE082" />

        {/* Stopwatch Beveled Outer Ring */}
        <circle cx="32" cy="36" r="23" fill="#804500" />
        <circle cx="32" cy="35" r="22.5" fill="url(#speed-gold)" />
        <circle cx="32" cy="35" r="18.5" fill="#B36B00" />

        {/* Stopwatch Inner Dial Face */}
        <circle cx="32" cy="35" r="17" fill="url(#speed-face)" stroke="#37464F" strokeWidth="1" />

        {/* Tick marks on dial */}
        <line x1="32" y1="20" x2="32" y2="23" stroke="#829BA8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="32" y1="47" x2="32" y2="50" stroke="#829BA8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="17" y1="35" x2="20" y2="35" stroke="#829BA8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="44" y1="35" x2="47" y2="35" stroke="#829BA8" strokeWidth="1.5" strokeLinecap="round" />

        {/* 3D Glowing Lightning Bolt in Center */}
        <path
          d="M34 21L24 34H32L30 47L41 32H33L37 21H34Z"
          fill="url(#speed-bolt)"
          stroke="#FF8F00"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M33 23L26 33H32L31 43L39 33H33L36 23H33Z"
          fill="#FFF9C4"
          opacity="0.75"
        />
      </g>
    </svg>
  );
}

export function PracticeStar3D({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`shrink-0 select-none ${className}`}>
      <defs>
        <linearGradient id="p-star-main" x1="32" y1="6" x2="32" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF59D" />
          <stop offset="30%" stopColor="#FFC800" />
          <stop offset="80%" stopColor="#E59400" />
          <stop offset="100%" stopColor="#8C4E00" />
        </linearGradient>
        <filter id="p-star-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>
      <g filter="url(#p-star-shadow)">
        {/* 3D Bottom Base Shadow */}
        <path
          d="M32 8L39.5 24L57 26.5L44.5 38.5L47.5 56L32 47.5L16.5 56L19.5 38.5L7 26.5L24.5 24L32 8Z"
          fill="#663900"
          transform="translate(0, 3)"
        />
        {/* Main Star Body */}
        <path
          d="M32 8L39.5 24L57 26.5L44.5 38.5L47.5 56L32 47.5L16.5 56L19.5 38.5L7 26.5L24.5 24L32 8Z"
          fill="url(#p-star-main)"
          stroke="#C78900"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* 3D Faceted Shading Triangles */}
        <path d="M32 8L32 35L24.5 24L32 8Z" fill="#FFFFFF" opacity="0.45" />
        <path d="M32 35L19.5 38.5L16.5 56L32 47.5L32 35Z" fill="#C67D00" opacity="0.6" />
        <path d="M32 35L47.5 56L44.5 38.5L32 35Z" fill="#FFD54F" opacity="0.4" />
        <path d="M32 8L39.5 24L32 35L32 8Z" fill="#FFF9C4" opacity="0.6" />
        <circle cx="32" cy="14" r="2.5" fill="#FFFFFF" opacity="0.85" />
      </g>
    </svg>
  );
}
