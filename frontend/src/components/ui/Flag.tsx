import React from 'react';

export type CountryCode = 'ES' | 'FR' | 'DE' | 'JP' | 'IT' | 'MX' | 'US' | 'GB';

interface FlagProps {
  country: CountryCode | string;
  className?: string;
}

/**
 * Flagpack-inspired clean, rounded vector country flags with subtle border and drop shadow.
 */
export function Flag({ country, className = 'w-7 h-5' }: FlagProps) {
  const code = (country || 'ES').toUpperCase();

  switch (code) {
    case 'ES': // Spain
      return (
        <svg viewBox="0 0 32 24" fill="none" className={`rounded-md shadow-sm border border-black/10 shrink-0 ${className}`}>
          <rect width="32" height="24" fill="#AA151B" />
          <rect y="6" width="32" height="12" fill="#F1BF00" />
          {/* Coat of arms shield detail */}
          <rect x="7" y="9" width="4" height="6" rx="1.5" fill="#AA151B" />
          <circle cx="9" cy="8" r="1.5" fill="#F1BF00" stroke="#AA151B" strokeWidth="0.5" />
        </svg>
      );

    case 'FR': // France
      return (
        <svg viewBox="0 0 32 24" fill="none" className={`rounded-md shadow-sm border border-black/10 shrink-0 ${className}`}>
          <rect width="10.66" height="24" fill="#002395" />
          <rect x="10.66" width="10.67" height="24" fill="#FFFFFF" />
          <rect x="21.33" width="10.67" height="24" fill="#ED2939" />
        </svg>
      );

    case 'DE': // Germany
      return (
        <svg viewBox="0 0 32 24" fill="none" className={`rounded-md shadow-sm border border-black/10 shrink-0 ${className}`}>
          <rect width="32" height="8" fill="#000000" />
          <rect y="8" width="32" height="8" fill="#DD0000" />
          <rect y="16" width="32" height="8" fill="#FFCE00" />
        </svg>
      );

    case 'JP': // Japan
      return (
        <svg viewBox="0 0 32 24" fill="none" className={`rounded-md shadow-sm border border-black/10 shrink-0 ${className}`}>
          <rect width="32" height="24" fill="#FFFFFF" />
          <circle cx="16" cy="12" r="6" fill="#BC002D" />
        </svg>
      );

    case 'IT': // Italy
      return (
        <svg viewBox="0 0 32 24" fill="none" className={`rounded-md shadow-sm border border-black/10 shrink-0 ${className}`}>
          <rect width="10.66" height="24" fill="#009246" />
          <rect x="10.66" width="10.67" height="24" fill="#FFFFFF" />
          <rect x="21.33" width="10.67" height="24" fill="#CE2B37" />
        </svg>
      );

    case 'MX': // Mexico
      return (
        <svg viewBox="0 0 32 24" fill="none" className={`rounded-md shadow-sm border border-black/10 shrink-0 ${className}`}>
          <rect width="10.66" height="24" fill="#006847" />
          <rect x="10.66" width="10.67" height="24" fill="#FFFFFF" />
          <rect x="21.33" width="10.67" height="24" fill="#CE1126" />
          <circle cx="16" cy="12" r="2.5" fill="#8B4513" />
        </svg>
      );

    case 'US': // USA
      return (
        <svg viewBox="0 0 32 24" fill="none" className={`rounded-md shadow-sm border border-black/10 shrink-0 ${className}`}>
          <rect width="32" height="24" fill="#B22234" />
          <path d="M0 3.7h32M0 7.4h32M0 11.1h32M0 14.8h32M0 18.5h32M0 22.2h32" stroke="#FFFFFF" strokeWidth="1.8" />
          <rect width="14" height="12" fill="#3C3B6E" />
          <circle cx="4" cy="4" r="1" fill="#FFFFFF" />
          <circle cx="10" cy="4" r="1" fill="#FFFFFF" />
          <circle cx="7" cy="8" r="1" fill="#FFFFFF" />
        </svg>
      );

    default: // Default fallback (Spain)
      return (
        <svg viewBox="0 0 32 24" fill="none" className={`rounded-md shadow-sm border border-black/10 shrink-0 ${className}`}>
          <rect width="32" height="24" fill="#AA151B" />
          <rect y="6" width="32" height="12" fill="#F1BF00" />
        </svg>
      );
  }
}
