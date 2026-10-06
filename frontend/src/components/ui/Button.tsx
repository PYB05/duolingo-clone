import React from 'react';
import { cn } from '@/lib/utils';
import { sfx } from '@/lib/sfx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'blue' | 'danger' | 'ghost' | 'locked';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      disabled = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        sfx.play('tap');
        onClick?.(e);
      }
    };

    const variantStyles = {
      primary:
        'bg-feather text-white border-b-4 border-feather-shadow hover:brightness-105 active:border-b-0 active:translate-y-1',
      secondary:
        'duo-bg-surface text-macaw border-2 duo-border border-b-4 hover:duo-bg-subtle active:border-b-2 active:translate-y-1',
      blue:
        'bg-macaw text-white border-b-4 border-macaw-shadow hover:brightness-105 active:border-b-0 active:translate-y-1',
      danger:
        'bg-cardinal text-white border-b-4 border-cardinal-shadow hover:brightness-105 active:border-b-0 active:translate-y-1',
      ghost:
        'bg-transparent duo-text-secondary hover:duo-bg-surface active:translate-y-0.5 border-none shadow-none',
      locked: 'bg-swan text-hare dark:bg-[#2A3942] dark:text-[#52656D] border-b-4 border-hare cursor-not-allowed',
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-xs rounded-xl tracking-wider',
      md: 'px-5 py-3 text-sm rounded-2xl tracking-wider',
      lg: 'px-8 py-4 text-base rounded-2xl tracking-widest',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || variant === 'locked'}
        onClick={handleClick}
        className={cn(
          'font-extrabold uppercase transition-all duration-75 select-none inline-flex items-center justify-center gap-2',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          disabled && 'opacity-60 cursor-not-allowed hover:brightness-100 active:translate-y-0 active:border-b-4',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
