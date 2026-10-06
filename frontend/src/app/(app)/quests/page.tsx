'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ChestIcon, GemIcon } from '@/components/icons';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { OwlMascot } from '@/components/mascot/OwlMascot';

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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <OwlMascot expression="thinking" className="w-20 h-20 animate-pulse mb-3" />
        <span className="font-extrabold duo-text-secondary text-sm tracking-wider">LOADING QUESTS...</span>
      </div>
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
              className="p-6 rounded-3xl border-2 border-beetle bg-gradient-to-r from-purple-950/30 to-indigo-950/30"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black text-beetle">{q.title}</h3>
                  <p className="text-xs font-bold duo-text-secondary mt-1">
                    Earn gems by completing this month’s challenge!
                  </p>
                </div>
                <div className="flex items-center gap-1.5 font-black text-base text-beetle duo-bg-surface px-3 py-1.5 rounded-2xl border border-beetle-shadow shadow-sm">
                  <GemIcon className="w-5 h-5" />
                  <span>+{q.reward_gems}</span>
                </div>
              </div>

              <div className="flex justify-between text-xs font-extrabold duo-text-secondary mb-1.5">
                <span>Progress</span>
                <span>
                  {q.progress} / {q.target} XP
                </span>
              </div>
              <ProgressBar progress={(q.progress / q.target) * 100} color="bee" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
