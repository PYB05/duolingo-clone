'use client';

import React from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={cn(
        'flex items-center justify-between gap-3 px-3 py-2 rounded-2xl border-2 transition-all font-extrabold text-xs tracking-wider select-none',
        theme === 'dark'
          ? 'bg-[#202F36] border-[#37464F] text-[#F1F7FB] hover:border-macaw'
          : 'bg-[#F7F7F7] border-[#E5E5E5] text-[#4B4B4B] hover:border-macaw',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-base">{theme === 'dark' ? '🌙' : '☀️'}</span>
        <span className="uppercase font-black text-[11px]">
          {theme === 'dark' ? 'DARK MODE' : 'LIGHT MODE'}
        </span>
      </div>
      <div
        className={cn(
          'w-9 h-5 rounded-full p-0.5 transition-colors flex items-center',
          theme === 'dark' ? 'bg-feather justify-end' : 'bg-swan justify-start'
        )}
      >
        <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
      </div>
    </button>
  );
}
