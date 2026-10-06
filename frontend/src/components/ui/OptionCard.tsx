import React from 'react';
import { cn } from '@/lib/utils';
import { sfx } from '@/lib/sfx';

export interface OptionCardProps {
  children: React.ReactNode;
  selected?: boolean;
  status?: 'default' | 'correct' | 'wrong';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  numberHint?: number | string;
}

export function OptionCard({
  children,
  selected = false,
  status = 'default',
  disabled = false,
  onClick,
  className,
  numberHint,
}: OptionCardProps) {
  const handleClick = () => {
    if (!disabled && onClick) {
      sfx.play('tap');
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
      className={cn(
        'relative flex items-center justify-between p-4 rounded-2xl border-2 border-b-4 transition-all duration-100 cursor-pointer select-none font-bold',
        // Default unselected state
        !selected &&
          status === 'default' &&
          'duo-bg-surface duo-border duo-text-primary hover:duo-bg-subtle active:border-b-2 active:translate-y-1',
        // Selected state
        selected &&
          status === 'default' &&
          'bg-sky/20 border-sky-border text-macaw active:border-b-2 active:translate-y-1',
        // Correct state
        status === 'correct' && 'bg-correct-bg/20 border-feather text-feather active:translate-y-0',
        // Wrong state
        status === 'wrong' && 'bg-wrong-bg/20 border-cardinal text-cardinal animate-shake active:translate-y-0',
        // Disabled state
        disabled && 'opacity-60 cursor-not-allowed hover:duo-bg-surface active:translate-y-0 active:border-b-4',
        className
      )}
    >
      <div className="flex items-center gap-3 w-full">{children}</div>

      {numberHint && (
        <span
          className={cn(
            'flex items-center justify-center w-7 h-7 text-xs font-black rounded-lg border duo-border duo-text-muted ml-2 shrink-0',
            selected && 'border-sky-border text-macaw'
          )}
        >
          {numberHint}
        </span>
      )}
    </div>
  );
}
