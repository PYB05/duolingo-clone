import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CrossIcon } from '../icons';

export interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  maxWidth = 'max-w-md',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog content */}
      <div
        className={cn(
          'relative z-10 w-full duo-bg-surface rounded-3xl border-2 duo-border shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200',
          maxWidth
        )}
      >
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 duo-text-muted hover:duo-text-primary transition-colors"
          >
            <CrossIcon className="w-5 h-5" />
          </button>
        )}

        {title && <h2 className="text-2xl font-black duo-text-primary mb-4">{title}</h2>}

        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
