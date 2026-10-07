'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import {
  PracticeHeart3D,
  PracticeMistakes3D,
  PracticeSpeed3D,
  PracticeStar3D,
  PracticeCrown3D,
} from '@/components/icons';
import { OwlMascot } from '@/components/mascot/OwlMascot';

interface PracticeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  badge?: string;
  badgeColor?: string;
  rewardText: string;
  practiceKind: string;
  buttonLabel?: string;
  buttonVariant?: 'primary' | 'secondary' | 'danger' | 'blue';
}

function PracticeCard({
  title,
  description,
  icon,
  iconBg,
  iconBorder,
  badge,
  badgeColor = 'bg-[#1CB0F6] text-white',
  rewardText,
  practiceKind,
  buttonLabel = 'PRACTICE',
  buttonVariant = 'primary',
}: PracticeCardProps) {
  return (
    <div className="relative p-6 rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] hover:border-[#1CB0F6] dark:hover:border-[#1CB0F6] bg-white dark:bg-[#131F24] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36]/70 shadow-lg transition-all flex flex-col justify-between overflow-hidden group">
      {badge && (
        <span
          className={`absolute top-5 right-5 text-[11px] font-black uppercase px-3 py-1 rounded-full ${badgeColor} tracking-wider shadow-sm`}
        >
          {badge}
        </span>
      )}

      <div>
        {/* 3D Inset Icon Tile */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${iconBg} border-2 border-b-4 ${iconBorder} shadow-md transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-1`}
        >
          {icon}
        </div>

        <h3 className="text-xl font-black text-[#3C3C3C] dark:text-[#F1F7FB] mb-1.5 transition-colors group-hover:text-[#1CB0F6]">
          {title}
        </h3>
        <p className="text-[#777777] dark:text-[#829BA8] font-bold text-sm mb-5 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#37464F] flex items-center justify-between gap-3">
        <span className="text-xs font-black text-[#FFC800] uppercase tracking-wider flex items-center gap-1.5">
          ⭐ {rewardText}
        </span>

        <Link href={`/lesson/start?practice=${practiceKind}`}>
          <Button variant={buttonVariant} size="md" className="uppercase tracking-wider font-black">
            {buttonLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function PracticePage() {
  const { data: user } = useQuery({ queryKey: ['me'], queryFn: () => api.getMe() });

  const currentHearts = user?.hearts ?? 5;
  const needsHearts = currentHearts < 5;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 select-none space-y-6">
      {/* Header banner */}
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-[#131F24] border-2 border-[#E5E5E5] dark:border-[#37464F] p-6 sm:p-7 rounded-3xl shadow-lg transition-colors">
        <div>
          <span className="text-xs font-black uppercase text-[#1CB0F6] tracking-widest block mb-1">
            PRACTICE HUB
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3C3C3C] dark:text-[#F1F7FB] mb-2 leading-tight">
            Strengthen your Spanish
          </h1>
          <p className="text-sm font-bold text-[#777777] dark:text-[#829BA8] max-w-md leading-relaxed">
            Practice past material, review your mistakes, or earn hearts back for free.
          </p>
        </div>
        <OwlMascot expression="happy" className="w-24 h-24 shrink-0 hidden sm:block" />
      </div>

      {/* Hearts status banner if hearts < 5 */}
      {needsHearts && (
        <div className="p-5 rounded-3xl bg-[#FF4B4B]/10 border-2 border-[#FF4B4B]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FF4B4B]/20 border-2 border-b-4 border-[#FF4B4B]/50 flex items-center justify-center shrink-0">
              <PracticeHeart3D className="w-8 h-8" />
            </div>
            <div>
              <p className="font-black text-base text-[#FF4B4B]">
                You have {currentHearts} {currentHearts === 1 ? 'heart' : 'hearts'} remaining!
              </p>
              <p className="text-xs font-bold text-[#829BA8] mt-0.5">
                Complete a practice session to earn +1 heart immediately.
              </p>
            </div>
          </div>
          <Link href="/lesson/start?practice=hearts_practice" className="w-full sm:w-auto">
            <Button variant="danger" size="md" fullWidth>
              PRACTICE FOR HEARTS
            </Button>
          </Link>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-5">
        {/* 1. Hearts Practice */}
        <PracticeCard
          title="Hearts Practice"
          description="Free review of completed skills. Answering questions correctly earns back hearts so you can keep progressing."
          icon={<PracticeHeart3D className="w-10 h-10" />}
          iconBg="bg-gradient-to-b from-[#3A181C] to-[#201014]"
          iconBorder="border-[#FF4B4B]/60"
          badge={needsHearts ? 'RECOMMENDED' : undefined}
          badgeColor="bg-[#FF4B4B] text-white"
          rewardText="+1 Heart & +5 XP"
          practiceKind="hearts_practice"
          buttonLabel="PRACTICE"
          buttonVariant="primary"
        />

        {/* 2. Personalized Mistakes Review */}
        <PracticeCard
          title="Mistakes Review"
          description="Targeted review of exercises you previously answered incorrectly. Master the exact patterns that challenged you."
          icon={<PracticeMistakes3D className="w-10 h-10" />}
          iconBg="bg-gradient-to-b from-[#18361C] to-[#102014]"
          iconBorder="border-[#58CC02]/60"
          rewardText="+10 XP"
          practiceKind="personalized"
          buttonLabel="REVIEW"
          buttonVariant="primary"
        />

        {/* 3. Timed Speed Challenge */}
        <PracticeCard
          title="Timed Speed Challenge"
          description="Test your rapid recall under time pressure. Answer as many questions as you can before the clock runs out."
          icon={<PracticeSpeed3D className="w-10 h-10" />}
          iconBg="bg-gradient-to-b from-[#3A3214] to-[#201C0E]"
          iconBorder="border-[#FFC800]/60"
          badge="60 SECONDS"
          badgeColor="bg-[#FFC800] text-[#131F24]"
          rewardText="+15 XP"
          practiceKind="timed"
          buttonLabel="START SPEED"
          buttonVariant="blue"
        />

        {/* 4. Unit Review */}
        <PracticeCard
          title="Unit Comprehensive Review"
          description="Mix of vocabulary, grammar patterns, listening, and sentence translations from across your active unit."
          icon={<PracticeStar3D className="w-10 h-10" />}
          iconBg="bg-gradient-to-b from-[#142C3A] to-[#0E1B24]"
          iconBorder="border-[#1CB0F6]/60"
          rewardText="+10 XP"
          practiceKind="unit_review"
          buttonLabel="REVIEW UNIT"
          buttonVariant="primary"
        />

        {/* 5. Legendary Challenge */}
        <PracticeCard
          title="Legendary Drills"
          description="High-difficulty challenge with strict mistake limits. Only for students ready to prove complete mastery."
          icon={<PracticeCrown3D className="w-11 h-11" />}
          iconBg="bg-gradient-to-b from-[#32183C] to-[#1E0F24]"
          iconBorder="border-[#CE82FF]/60"
          badge="CHALLENGE"
          badgeColor="bg-[#CE82FF] text-white"
          rewardText="+40 XP"
          practiceKind="legendary"
          buttonLabel="PROVE MASTERY"
          buttonVariant="secondary"
        />
      </div>
    </div>
  );
}
