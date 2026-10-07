'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { SuperBadge, SuperFlyingDuo } from '@/components/icons/WidgetIcons';
import { PracticeHeart3D, PracticeCrown3D } from '@/components/icons/PracticeIcons';
import { DuolingoShieldIcon } from '@/components/icons/NavIcons';
import { OwlMascot } from '@/components/mascot/OwlMascot';
import { sfx } from '@/lib/sfx';

interface SuperDuolingoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuperDuolingoModal({ isOpen, onClose }: SuperDuolingoModalProps) {
  const [activated, setActivated] = useState(false);

  const handleActivate = () => {
    sfx.play('fanfare');
    setActivated(true);
  };

  const handleFinish = () => {
    setActivated(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton maxWidth="max-w-md">
      {!activated ? (
        <div className="flex flex-col items-center text-center p-2 select-none">
          {/* Animated Super Duo Flying */}
          <div className="relative mb-4 mt-2">
            <div className="animate-duo-bob">
              <SuperFlyingDuo className="w-36 h-32 drop-shadow-2xl" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-indigo-500/20 rounded-full blur-sm animate-pulse" />
          </div>

          <SuperBadge className="h-8 mb-3" />

          <h2 className="text-2xl font-black text-[#3C3C3C] dark:text-[#F1F7FB] mb-2 leading-tight">
            Level Up with Super
          </h2>

          <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#829BA8] max-w-xs mb-6">
            Get unlimited hearts, personalized mistake practice, and unlimited legendary challenges!
          </p>

          {/* Perks list with authentic 3D Duolingo SVG Icons */}
          <div className="w-full space-y-3 mb-6 text-left">
            {[
              {
                icon: <PracticeHeart3D className="w-9 h-9 drop-shadow" />,
                title: 'Unlimited Hearts',
                desc: 'Never run out of energy during lessons',
              },
              {
                icon: <DuolingoShieldIcon className="w-9 h-9 drop-shadow" />,
                title: 'Personalized Practice',
                desc: 'Target weak vocabulary and grammar mistakes',
              },
              {
                icon: <PracticeCrown3D className="w-9 h-9 drop-shadow" />,
                title: 'Legendary Challenges',
                desc: 'Zero gem cost to master legendary badges',
              },
            ].map((perk, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#F7F7F7] dark:bg-[#131F24] border-2 border-[#E5E5E5] dark:border-[#37464F] hover:border-[#84D8FF] transition-colors group"
              >
                <div className="shrink-0 group-hover:scale-110 transition-transform">
                  {perk.icon}
                </div>
                <div>
                  <div className="text-xs font-black text-[#3C3C3C] dark:text-[#F1F7FB] uppercase tracking-wider">
                    {perk.title}
                  </div>
                  <div className="text-[11px] font-bold text-[#777777] dark:text-[#829BA8] mt-0.5">
                    {perk.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleActivate}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#EC4899] hover:brightness-110 active:scale-98 text-white font-black text-sm uppercase tracking-wider border-b-4 border-[#4338CA] transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <span>START MY 1 WEEK FREE TRIAL</span>
          </button>

          <span className="text-[10px] font-bold text-[#AFAFAF] mt-3 uppercase tracking-wider">
            NO COMMITMENT • CANCEL ANYTIME
          </span>
        </div>
      ) : (
        /* Confetti / Success State with Celebrating Duo */
        <div className="flex flex-col items-center text-center p-4 select-none animate-in fade-in zoom-in-95 duration-200">
          <div className="relative mb-4">
            <OwlMascot expression="celebrating" className="w-28 h-28 drop-shadow-2xl animate-bounce" />
            <div className="absolute -inset-2 rounded-full border-4 border-[#58CC02] animate-ping opacity-30 pointer-events-none" />
          </div>

          <h2 className="text-2xl font-black text-[#58CC02] mb-2 leading-tight">
            You are now SUPER!
          </h2>

          <p className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#829BA8] max-w-xs mb-6">
            Your 7-day free trial is active. Enjoy unlimited hearts and instant review privileges!
          </p>

          <Button variant="primary" size="lg" fullWidth onClick={handleFinish}>
            CONTINUE LEARNING
          </Button>
        </div>
      )}
    </Modal>
  );
}
