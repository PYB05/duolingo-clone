'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { OwlMascot } from '../mascot/OwlMascot';

export interface OutOfHeartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gems: number;
  onRefill: () => void;
}

export function OutOfHeartsModal({
  isOpen,
  onClose,
  gems,
  onRefill,
}: OutOfHeartsModalProps) {
  const router = useRouter();

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} maxWidth="max-w-sm">
      <div className="py-2 flex flex-col items-center">
        <OwlMascot expression="sad" className="w-24 h-24 mb-3" />
        <h3 className="text-2xl font-black text-eel mb-1">You ran out of hearts!</h3>
        <p className="text-sm font-bold text-wolf mb-6 text-center">
          Keep learning by practicing to earn hearts, or refill your hearts with gems.
        </p>

        <div className="space-y-3 w-full">
          <Button
            variant="blue"
            size="lg"
            fullWidth
            onClick={() => {
              onClose();
              router.push('/practice');
            }}
          >
            PRACTICE TO EARN HEARTS
          </Button>

          <Button
            variant="primary"
            size="md"
            fullWidth
            disabled={gems < 350}
            onClick={onRefill}
          >
            REFILL HEARTS (350 💎)
          </Button>

          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={() => {
              onClose();
              router.push('/learn');
            }}
          >
            NO THANKS
          </Button>
        </div>
      </div>
    </Modal>
  );
}
