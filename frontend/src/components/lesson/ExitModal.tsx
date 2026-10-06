'use client';

import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { OwlMascot } from '../mascot/OwlMascot';

export interface ExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

export function ExitModal({ isOpen, onClose, onConfirmExit }: ExitModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} maxWidth="max-w-sm">
      <div className="py-2 flex flex-col items-center">
        <OwlMascot expression="worried" className="w-24 h-24 mb-3" />
        <h3 className="text-2xl font-black text-eel mb-1">Wait, don’t go!</h3>
        <p className="text-sm font-bold text-wolf mb-6 text-center">
          You’ll lose your progress in this lesson if you quit now.
        </p>

        <div className="space-y-3 w-full">
          <Button variant="primary" size="lg" fullWidth onClick={onClose}>
            KEEP LEARNING
          </Button>

          <Button variant="ghost" size="md" fullWidth onClick={onConfirmExit}>
            END SESSION
          </Button>
        </div>
      </div>
    </Modal>
  );
}
