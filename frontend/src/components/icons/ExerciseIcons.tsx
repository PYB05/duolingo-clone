import React from 'react';

/**
 * High-fidelity 3D Duolingo Exercise Option Illustration Icons
 * Matches authentic Duolingo cartoon flat-3D vector style with bold outlines, glossy highlights, and rich color shading.
 */

// 1. Milk Glass (la leche)
export function MilkGlassIcon({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`shrink-0 select-none ${className}`}>
      <defs>
        <linearGradient id="milk-body" x1="32" y1="20" x2="32" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="glass-rim" x1="16" y1="8" x2="48" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>

      {/* Glass Shadow */}
      <ellipse cx="32" cy="59" rx="16" ry="3.5" fill="#000000" opacity="0.18" />

      {/* Glass Outline / Exterior */}
      <path
        d="M17 12 L22 55 C22.5 57.5 25 58.5 32 58.5 C39 58.5 41.5 57.5 42 55 L47 12 Z"
        fill="#E0F2FE"
        stroke="#38BDF8"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Milk Liquid Body */}
      <path
        d="M19 24 L22.5 54 C23 56 26 56.5 32 56.5 C38 56.5 41 56 41.5 54 L45 24 C45 24 38 27 32 27 C26 27 19 24 19 24 Z"
        fill="url(#milk-body)"
        stroke="#94A3B8"
        strokeWidth="1.5"
      />

      {/* Milk Surface Ellipse */}
      <ellipse cx="32" cy="24" rx="13" ry="3.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />

      {/* Specular Glint Highlight on Glass */}
      <path
        d="M23 16 L25 50"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Glass Top Rim */}
      <ellipse cx="32" cy="12" rx="15" ry="3.8" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="2.5" />
    </svg>
  );
}

// 2. Water Droplet / Splash (el agua)
export function WaterDropletIcon({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`shrink-0 select-none ${className}`}>
      <defs>
        <linearGradient id="water-grad" x1="20" y1="10" x2="44" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="35%" stopColor="#38BDF8" />
          <stop offset="75%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
      </defs>

      {/* Drop Shadow */}
      <ellipse cx="32" cy="59" rx="16" ry="3.5" fill="#000000" opacity="0.2" />

      {/* Main Droplet 3D Underlay */}
      <path
        d="M32 7 C32 7 14 30 14 43 C14 53 22 58 32 58 C42 58 50 53 50 43 C50 30 32 7 32 7 Z"
        fill="#075985"
      />

      {/* Main Droplet Face */}
      <path
        d="M32 9 C32 9 16 31 16 43 C16 51.5 23 56 32 56 C41 56 48 51.5 48 43 C48 31 32 9 32 9 Z"
        fill="url(#water-grad)"
        stroke="#0284C7"
        strokeWidth="2"
      />

      {/* Curved Glossy Highlight Glint */}
      <path
        d="M23 43 C23 35 29 23 32 17"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Small Secondary Specular Dot */}
      <circle cx="23" cy="48" r="2.5" fill="#FFFFFF" opacity="0.85" />
    </svg>
  );
}

// 3. Bread Loaf (el pan)
export function BreadLoafIcon({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`shrink-0 select-none ${className}`}>
      <defs>
        <linearGradient id="bread-crust" x1="32" y1="16" x2="32" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="60%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="bread-top" x1="18" y1="18" x2="46" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
      </defs>

      {/* Loaf Shadow */}
      <ellipse cx="32" cy="54" rx="22" ry="4" fill="#000000" opacity="0.2" />

      {/* Loaf 3D Bottom/Under Bevel */}
      <path
        d="M10 32 C8 24 18 16 32 16 C46 16 56 24 54 32 L51 49 C50 52 46 54 32 54 C18 54 14 52 13 49 Z"
        fill="#92400E"
      />

      {/* Loaf Main Body */}
      <path
        d="M11 30 C9 23 19 17 32 17 C45 17 55 23 53 30 L50 46 C49 49 45 51 32 51 C19 51 15 49 14 46 Z"
        fill="url(#bread-crust)"
        stroke="#B45309"
        strokeWidth="2"
      />

      {/* Golden Bread Top Crust Dome */}
      <path
        d="M12 28 C12 20 20 16 32 16 C44 16 52 20 52 28 C52 33 44 36 32 36 C20 36 12 33 12 28 Z"
        fill="url(#bread-top)"
        stroke="#D97706"
        strokeWidth="2"
      />

      {/* Baker Score Cuts / Diagonal Slits */}
      <path d="M22 23 C24 26 27 27 28 29" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 22 C32 25 35 26 36 28" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M38 21 C40 24 43 25 44 27" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />

      {/* Specular Glow */}
      <ellipse cx="26" cy="20" rx="6" ry="2" fill="#FFFFFF" opacity="0.6" transform="rotate(-10 26 20)" />
    </svg>
  );
}

// 4. Red Apple (la manzana)
export function AppleIcon({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`shrink-0 select-none ${className}`}>
      <defs>
        <radialGradient id="apple-body" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="40%" stopColor="#FF4B4B" />
          <stop offset="85%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="32" cy="57" rx="18" ry="3.5" fill="#000000" opacity="0.2" />

      {/* Stem */}
      <path
        d="M32 20 C32 14 36 8 40 6"
        stroke="#78350F"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Green Leaf */}
      <path
        d="M33 14 C38 10 46 11 48 14 C48 19 40 20 33 14 Z"
        fill="#58CC02"
        stroke="#3F8F03"
        strokeWidth="1.5"
      />

      {/* Apple 3D Base */}
      <path
        d="M32 21 C26 15 12 18 12 34 C12 48 24 57 32 57 C40 57 52 48 52 34 C52 18 38 15 32 21 Z"
        fill="#7F1D1D"
      />

      {/* Apple Main Glossy Face */}
      <path
        d="M32 20 C26 14 13 17 13 33 C13 46 24 55 32 55 C40 55 51 46 51 33 C51 17 38 14 32 20 Z"
        fill="url(#apple-body)"
      />

      {/* Specular Sheen Arc */}
      <path
        d="M20 26 C16 32 17 40 20 44"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <circle cx="21" cy="23" r="2" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

// 5. Boy Character Portrait (el niño)
export function BoyAvatarIcon({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`shrink-0 select-none ${className}`}>
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="16" ry="3.5" fill="#000000" opacity="0.2" />

      {/* Blue Shirt */}
      <path d="M18 52 C18 44 24 40 32 40 C40 40 46 44 46 52 L44 58 L20 58 Z" fill="#1CB0F6" stroke="#0284C7" strokeWidth="2" />
      {/* Collar */}
      <path d="M28 40 L32 46 L36 40" fill="#FFFFFF" />

      {/* Head */}
      <ellipse cx="32" cy="30" rx="15" ry="14" fill="#FED7AA" stroke="#FDBA74" strokeWidth="1.5" />

      {/* Ears */}
      <circle cx="17" cy="31" r="3.5" fill="#FED7AA" stroke="#FDBA74" strokeWidth="1" />
      <circle cx="47" cy="31" r="3.5" fill="#FED7AA" stroke="#FDBA74" strokeWidth="1" />

      {/* Brown Hair */}
      <path d="M16 27 C16 16 23 12 32 12 C41 12 48 16 48 27 C46 22 42 19 38 19 C34 19 33 22 30 20 C27 22 22 21 16 27 Z" fill="#78350F" />

      {/* Red Cap */}
      <path d="M18 20 C18 13 24 8 32 8 C40 8 46 13 46 20 Z" fill="#FF4B4B" stroke="#DC2626" strokeWidth="1.5" />
      <path d="M42 16 L56 18 L52 23 L40 21 Z" fill="#FF4B4B" stroke="#DC2626" strokeWidth="1.5" />

      {/* Happy Eyes */}
      <circle cx="26" cy="30" r="2.5" fill="#3C3C3C" />
      <circle cx="38" cy="30" r="2.5" fill="#3C3C3C" />

      {/* Cheerful Smile */}
      <path d="M28 36 C30 39 34 39 36 36" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 6. Girl Character Portrait (la niña)
export function GirlAvatarIcon({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`shrink-0 select-none ${className}`}>
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="16" ry="3.5" fill="#000000" opacity="0.2" />

      {/* Purple Shirt */}
      <path d="M18 52 C18 44 24 40 32 40 C40 40 46 44 46 52 L44 58 L20 58 Z" fill="#CE82FF" stroke="#9333EA" strokeWidth="2" />

      {/* Head */}
      <ellipse cx="32" cy="30" rx="15" ry="14" fill="#FED7AA" stroke="#FDBA74" strokeWidth="1.5" />

      {/* Ears */}
      <circle cx="17" cy="31" r="3.5" fill="#FED7AA" stroke="#FDBA74" strokeWidth="1" />
      <circle cx="47" cy="31" r="3.5" fill="#FED7AA" stroke="#FDBA74" strokeWidth="1" />

      {/* Pigtails / Hair */}
      <circle cx="14" cy="22" r="7" fill="#78350F" />
      <circle cx="50" cy="22" r="7" fill="#78350F" />
      {/* Hair Ties */}
      <circle cx="18" cy="25" r="2.5" fill="#FF4B4B" />
      <circle cx="46" cy="25" r="2.5" fill="#FF4B4B" />
      {/* Bangs */}
      <path d="M17 24 C22 18 28 17 32 17 C36 17 42 18 47 24 C44 21 38 20 32 20 C26 20 20 21 17 24 Z" fill="#78350F" />

      {/* Big Eyes with Sparkle */}
      <circle cx="26" cy="30" r="2.5" fill="#3C3C3C" />
      <circle cx="25" cy="29" r="0.8" fill="#FFFFFF" />
      <circle cx="38" cy="30" r="2.5" fill="#3C3C3C" />
      <circle cx="37" cy="29" r="0.8" fill="#FFFFFF" />

      {/* Rosy Cheeks */}
      <ellipse cx="22" cy="34" rx="2.5" ry="1.5" fill="#FB7185" opacity="0.6" />
      <ellipse cx="42" cy="34" rx="2.5" ry="1.5" fill="#FB7185" opacity="0.6" />

      {/* Cheerful Smile */}
      <path d="M28 36 C30 39 34 39 36 36" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 7. Woman Portrait (la mujer)
export function WomanAvatarIcon({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`shrink-0 select-none ${className}`}>
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="16" ry="3.5" fill="#000000" opacity="0.2" />

      {/* Coral Red Blouse */}
      <path d="M18 52 C18 43 24 39 32 39 C40 39 46 43 46 52 L44 58 L20 58 Z" fill="#FF4B4B" stroke="#DC2626" strokeWidth="2" />

      {/* Long Brown Hair Behind */}
      <path d="M14 26 C14 38 16 50 20 54 L44 54 C48 50 50 38 50 26 Z" fill="#451A03" />

      {/* Head */}
      <ellipse cx="32" cy="29" rx="14" ry="13" fill="#FED7AA" stroke="#FDBA74" strokeWidth="1.5" />

      {/* Stylish Hair Front */}
      <path d="M18 24 C22 15 30 14 36 14 C44 14 48 18 48 28 C45 22 39 20 32 20 C25 20 20 22 18 24 Z" fill="#5B21B6" opacity="0" />
      <path d="M18 24 C24 16 32 15 46 20 C42 16 35 15 31 15 C24 15 20 18 18 24 Z" fill="#78350F" />

      {/* Friendly Eyes */}
      <circle cx="26" cy="29" r="2.5" fill="#3C3C3C" />
      <circle cx="38" cy="29" r="2.5" fill="#3C3C3C" />

      {/* Earrings */}
      <circle cx="17" cy="32" r="2" fill="#FFC800" />
      <circle cx="47" cy="32" r="2" fill="#FFC800" />

      {/* Smile */}
      <path d="M28 35 C30 38 34 38 36 35" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 8. Universal Smart Exercise Icon Resolver
export function ExerciseIllustration({
  text,
  emoji,
  className = 'w-12 h-12',
}: {
  text?: string | null;
  emoji?: string | null;
  className?: string;
}) {
  const norm = (text || '').toLowerCase().trim();
  const e = emoji || '';

  if (norm.includes('leche') || norm.includes('milk') || e === '🥛') {
    return <MilkGlassIcon className={className} />;
  }
  if (norm.includes('agua') || norm.includes('water') || e === '💧' || e === '🚰') {
    return <WaterDropletIcon className={className} />;
  }
  if (norm.includes('pan') || norm.includes('bread') || e === '🍞') {
    return <BreadLoafIcon className={className} />;
  }
  if (norm.includes('manzana') || norm.includes('apple') || e === '🍎') {
    return <AppleIcon className={className} />;
  }
  if (norm.includes('niño') || norm.includes('boy') || e === '👦') {
    return <BoyAvatarIcon className={className} />;
  }
  if (norm.includes('niña') || norm.includes('girl') || e === '👧') {
    return <GirlAvatarIcon className={className} />;
  }
  if (norm.includes('mujer') || norm.includes('woman') || e === '👩') {
    return <WomanAvatarIcon className={className} />;
  }

  // Fallback to emoji if available
  if (emoji) {
    return <span className="text-4xl select-none">{emoji}</span>;
  }

  return null;
}
