'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { LockIcon } from '../icons';
import { OwlMascot } from '../mascot/OwlMascot';

export interface PathPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  skill: {
    id: number;
    title: string;
    kind: string;
    state: string;
    lessons_completed: number;
    total_levels: number;
    is_legendary: boolean;
  } | null;
  hearts: number;
  onOpenChest?: (skillId: number) => void;
}

export function PathPopover({
  isOpen,
  onClose,
  skill,
  hearts,
  onOpenChest,
}: PathPopoverProps) {
  const router = useRouter();

  if (!skill) return null;

  const isLocked = skill.state === 'locked';
  const isCompleted = skill.state === 'completed' || skill.state === 'legendary';

  const handleStartLesson = () => {
    onClose();
    // Start lesson level = lessons_completed + 1
    // The API uses lesson_id. For our seed structure, skill lessons are accessible.
    // We route to lesson player page with query
    router.push(`/lesson/start?skillId=${skill.id}&level=${skill.lessons_completed + 1}`);
  };

  const handlePractice = () => {
    onClose();
    router.push(`/lesson/start?practice=personalized&skillId=${skill.id}`);
  };

  const handleLegendary = () => {
    onClose();
    router.push(`/lesson/start?practice=legendary&skillId=${skill.id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton maxWidth="max-w-sm">
      {isLocked ? (
        <div className="py-2 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-polar border-2 border-swan flex items-center justify-center mb-3">
            <LockIcon className="w-8 h-8 text-hare" />
          </div>
          <h3 className="text-xl font-black text-eel mb-1">{skill.title}</h3>
          <p className="text-xs font-bold text-wolf mb-5">
            Complete previous skills on your path to unlock this lesson!
          </p>
          <Button variant="secondary" size="md" fullWidth onClick={onClose}>
            GOT IT
          </Button>
        </div>
      ) : skill.kind === 'chest' ? (
        <div className="py-2 flex flex-col items-center">
          <OwlMascot expression="celebrating" className="w-24 h-24 mb-2" />
          <h3 className="text-xl font-black text-eel mb-1">Treasure Chest!</h3>
          <p className="text-xs font-bold text-wolf mb-5">
            Open this chest to claim free bonus gems!
          </p>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => {
              onOpenChest?.(skill.id);
              onClose();
            }}
          >
            OPEN (+20 💎)
          </Button>
        </div>
      ) : hearts <= 0 && !isCompleted ? (
        <div className="py-2 flex flex-col items-center">
          <OwlMascot expression="sad" className="w-24 h-24 mb-2" />
          <h3 className="text-xl font-black text-eel mb-1">You need hearts!</h3>
          <p className="text-xs font-bold text-wolf mb-5">
            You ran out of hearts. Practice old lessons to earn hearts or refill in the shop.
          </p>
          <div className="space-y-2 w-full">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => {
                onClose();
                router.push('/practice');
              }}
            >
              PRACTICE FOR HEARTS
            </Button>
            <Button
              variant="blue"
              size="md"
              fullWidth
              onClick={() => {
                onClose();
                router.push('/shop');
              }}
            >
              REFILL IN SHOP
            </Button>
          </div>
        </div>
      ) : isCompleted ? (
        <div className="py-2 flex flex-col items-center">
          <OwlMascot expression="happy" className="w-24 h-24 mb-2" />
          <h3 className="text-xl font-black text-eel mb-1">{skill.title}</h3>
          <p className="text-xs font-bold text-feather mb-5">Skill Completed!</p>

          <div className="space-y-2 w-full">
            <Button variant="primary" size="md" fullWidth onClick={handlePractice}>
              PRACTICE (+5 XP)
            </Button>

            {!skill.is_legendary && (
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={handleLegendary}
                className="bg-beetle border-beetle-shadow"
              >
                LEGENDARY (+40 XP)
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="py-2 flex flex-col items-center">
          <OwlMascot expression="happy" className="w-24 h-24 mb-2" />
          <h3 className="text-xl font-black text-eel mb-1">{skill.title}</h3>
          <p className="text-xs font-bold text-wolf mb-5">
            Lesson {skill.lessons_completed + 1} of {skill.total_levels}
          </p>

          <Button variant="primary" size="lg" fullWidth onClick={handleStartLesson}>
            START (+10 XP)
          </Button>
        </div>
      )}
    </Modal>
  );
}
