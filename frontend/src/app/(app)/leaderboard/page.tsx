'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ShieldIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { DuoLoadingScreen } from '@/components/ui/DuoLoadingScreen';

export default function LeaderboardPage() {
  const { data: lb, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => api.getLeaderboard(),
  });

  if (isLoading || !lb) {
    return (
      <DuoLoadingScreen
        message="LOADING LEAGUES..."
        subtext="Fetching the latest division rankings!"
      />
    );
  }

  return (
    <div className="pb-16 select-none max-w-xl mx-auto">
      {/* League Header Shield */}
      <div className="flex flex-col items-center text-center p-6 mb-6 border-b-2 duo-border">
        <ShieldIcon tier={lb.tier} color={lb.tier_color} className="w-20 h-20 mb-3" />
        <h1 className="text-2xl sm:text-3xl font-black duo-text-primary uppercase tracking-wide">
          {lb.tier_name} League
        </h1>
        <p className="text-xs sm:text-sm font-bold duo-text-secondary mt-1">
          Top {lb.promotion_zone} advance to the next league!
        </p>
      </div>

      {/* Standings List */}
      <div className="space-y-1">
        {lb.standings.map((standing, index) => {
          const isPromotionZoneCutoff = index === lb.promotion_zone - 1;
          const isDemotionZoneCutoff = index === lb.demotion_zone - 2;

          return (
            <React.Fragment key={standing.user.id}>
              <div
                className={cn(
                  'flex items-center justify-between p-3.5 rounded-2xl transition-all',
                  standing.user.is_current_user
                    ? 'bg-sky/20 border-2 border-sky-border font-black text-macaw shadow-sm'
                    : 'duo-bg-surface hover:duo-bg-subtle'
                )}
              >
                {/* Rank & User details */}
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'w-7 text-center font-black text-sm',
                      standing.rank === 1 && 'text-bee',
                      standing.rank === 2 && 'duo-text-muted',
                      standing.rank === 3 && 'text-amber-600',
                      standing.rank > 3 && 'duo-text-secondary'
                    )}
                  >
                    {standing.rank === 1 ? '🥇' : standing.rank === 2 ? '🥈' : standing.rank === 3 ? '🥉' : standing.rank}
                  </span>

                  {/* Avatar circle with initial */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm shadow-sm shrink-0"
                    style={{ backgroundColor: standing.user.avatar_color }}
                  >
                    {standing.user.display_name.charAt(0)}
                  </div>

                  <span className="font-bold text-sm duo-text-primary truncate max-w-[180px]">
                    {standing.user.display_name}
                  </span>
                </div>

                {/* Weekly XP */}
                <span className="font-extrabold text-sm duo-text-secondary shrink-0">
                  {standing.weekly_xp} XP
                </span>
              </div>

              {/* Promotion Zone Divider */}
              {isPromotionZoneCutoff && (
                <div className="flex items-center gap-2 py-2 px-3 text-[11px] font-black text-feather uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-feather shrink-0" />
                  <span>▲ PROMOTION ZONE</span>
                  <div className="flex-1 h-0.5 bg-feather/30" />
                </div>
              )}

              {/* Demotion Zone Divider */}
              {isDemotionZoneCutoff && (
                <div className="flex items-center gap-2 py-2 px-3 text-[11px] font-black text-cardinal uppercase tracking-wider mt-2">
                  <span className="w-2 h-2 rounded-full bg-cardinal shrink-0" />
                  <span>▼ DEMOTION ZONE</span>
                  <div className="flex-1 h-0.5 bg-cardinal/30" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
