import React from 'react';
import { cn } from '@/lib/utils';

export function ProgressBar({
  progress = 0, // 0 to 100
  className,
  color = 'feather',
}: {
  progress?: number;
  className?: string;
  color?: 'feather' | 'macaw' | 'bee';
}) {
  const clamped = Math.max(0, Math.min(100, progress));

  const bgColors = {
    feather: 'bg-feather',
    macaw: 'bg-macaw',
    bee: 'bg-bee',
  };

  return (
    <div className={cn('relative w-full h-4 bg-swan rounded-full overflow-hidden', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500 ease-out relative', bgColors[color])}
        style={{ width: `${clamped}%` }}
      >
        {/* Glossy inner highlight strip */}
        {clamped > 5 && (
          <div className="absolute top-1 left-2 right-2 h-1 bg-white/40 rounded-full" />
        )}
      </div>
    </div>
  );
}
