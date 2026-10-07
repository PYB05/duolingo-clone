'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ChestIcon, GemIcon } from '@/components/icons';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { OwlMascot } from '@/components/mascot/OwlMascot';
import { DuoLoadingScreen } from '@/components/ui/DuoLoadingScreen';

export default function QuestsPage() {
  const queryClient = useQueryClient();

  const { data: quests, isLoading } = useQuery({
    queryKey: ['quests'],
    queryFn: () => api.getQuests(),
  });

  const claimMutation = useMutation({
    mutationFn: (questId: number) => api.claimQuest(questId),
    onSuccess: (data) => {
      alert(`🎉 Claimed ${data.reward_gems} gems!`);
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Could not claim quest reward.');
    },
  });

  if (isLoading || !quests) {
    return (
      <DuoLoadingScreen
        message="LOADING QUESTS..."
        subtext="Fetching daily challenges and October badge goals!"
      />
    );
  }

  return (
    <div className="pb-16 select-none max-w-xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex items-center gap-4 p-6 rounded-3xl bg-amber-500/15 border-2 border-bee">
        <OwlMascot expression="happy" className="w-20 h-20 shrink-0" />
        <div>
          <h1 className="text-2xl font-black duo-text-primary">Quests</h1>
          <p className="text-xs sm:text-sm font-bold duo-text-secondary mt-1">
            Complete daily and monthly challenges to earn free gems!
          </p>
        </div>
      </div>

      {/* Daily Quests Section */}
      <div>
        <h2 className="text-lg font-black duo-text-primary uppercase tracking-wider mb-4">
          Daily Quests
        </h2>

        <div className="space-y-4">
          {quests.daily_quests.map((q) => {
            const isFinished = q.is_completed;
            const isClaimed = q.is_claimed;
            const percent = Math.min(100, (q.progress / q.target) * 100);

            return (
              <div
                key={q.id}
                className="flex items-center justify-between p-4 rounded-2xl border-2 duo-border duo-bg-surface gap-4"
              >
                <div className="flex items-center gap-3 w-full">
                  <ChestIcon className="w-10 h-10 shrink-0" opened={isClaimed} />

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1 text-sm font-bold duo-text-primary">
                      <span>{q.title}</span>
                      <span className="duo-text-secondary text-xs">
                        {q.progress} / {q.target}
                      </span>
                    </div>

                    <ProgressBar progress={percent} color={isFinished ? 'bee' : 'macaw'} />
                  </div>
                </div>

                {/* Reward / Action */}
                <div className="shrink-0">
                  {isClaimed ? (
                    <span className="text-xs font-black duo-text-muted uppercase tracking-wider px-3 py-2">
                      CLAIMED
                    </span>
                  ) : isFinished ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => claimMutation.mutate(q.id)}
                    >
                      CLAIM (+{q.reward_gems} 💎)
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1 font-black text-xs text-macaw px-3 py-2 bg-sky/20 rounded-xl border border-sky-border">
                      <GemIcon className="w-4 h-4" />
                      <span>+{q.reward_gems}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Challenge Banner */}
      {quests.monthly_quests.length > 0 && (
        <div>
          <h2 className="text-lg font-black duo-text-primary uppercase tracking-wider mb-4">
            Monthly Challenge
          </h2>

          {quests.monthly_quests.map((q) => (
            <div
              key={q.id}
              className="p-6 rounded-3xl border-2 border-[#CE82FF]/60 dark:border-[#CE82FF]/40 bg-[#FAF5FF] dark:bg-[#1A162B] shadow-lg relative overflow-hidden transition-colors"
            >
              {/* Subtle Ambient Glow in Dark Mode */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#CE82FF]/10 dark:bg-[#CE82FF]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-start sm:items-center justify-between gap-4 mb-4 relative z-10">
                <div className="flex items-center gap-3.5">
                  {/* 3D October Challenge Badge / Medal Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#251E38] border-2 border-b-4 border-[#E9D5FF] dark:border-[#3E345C] flex items-center justify-center shrink-0 shadow-sm">
                    <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9 drop-shadow select-none">
                      {/* Ribbon Tails */}
                      <path d="M12 22L8 34L14 31L18 34L16 22Z" fill="#CE82FF" />
                      <path d="M24 22L28 34L22 31L18 34L20 22Z" fill="#A855F7" />
                      {/* Medal Outer Rim */}
                      <circle cx="18" cy="16" r="13" fill="#D97706" />
                      <circle cx="18" cy="15" r="12.5" fill="#FFC800" />
                      {/* Medal Inset Face */}
                      <circle cx="18" cy="15" r="9.5" fill="#FFA000" />
                      {/* 3D Gold Star */}
                      <path
                        d="M18 8L20 13L25 13.5L21.2 17L22.2 22L18 19.5L13.8 22L14.8 17L11 13.5L16 13L18 8Z"
                        fill="#FFFFFF"
                      />
                    </svg>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#7E22CE] dark:text-[#E9D5FF] bg-[#CE82FF]/20 dark:bg-[#CE82FF]/25 border border-[#CE82FF]/30 dark:border-[#CE82FF]/40 px-2.5 py-0.5 rounded-full">
                        OCTOBER BADGE
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-[#2E1065] dark:text-[#FFFFFF] leading-snug">
                      {q.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-[#6B21A8] dark:text-[#D8B4FE] mt-0.5">
                      Earn gems by completing this month’s challenge!
                    </p>
                  </div>
                </div>

                {/* 3D Duolingo Gem Reward Badge */}
                <div className="flex items-center gap-1.5 font-black text-sm text-[#1CB0F6] bg-white dark:bg-[#202F36] px-3.5 py-2 rounded-2xl border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] shadow-sm shrink-0">
                  <GemIcon className="w-5 h-5 drop-shadow" />
                  <span>+{q.reward_gems}</span>
                </div>
              </div>

              {/* Progress Labels & Bar */}
              <div className="relative z-10 pt-1">
                <div className="flex justify-between text-xs font-black uppercase tracking-wider text-[#7E22CE] dark:text-[#F1F7FB] mb-2">
                  <span>Progress</span>
                  <span className="text-[#9333EA] dark:text-[#CE82FF]">
                    {q.progress} / {q.target} XP
                  </span>
                </div>
                <ProgressBar
                  progress={(q.progress / q.target) * 100}
                  color="bee"
                  className="h-4.5 bg-[#E9D5FF]/60 dark:bg-[#2B2342] border border-[#D8B4FE]/50 dark:border-[#3E345C]"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
