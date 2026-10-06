'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { BoltIcon, CrownIcon, FlameIcon, ShieldIcon, TrophyIcon } from '@/components/icons';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { OwlMascot } from '@/components/mascot/OwlMascot';

export default function ProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.getProfile(),
  });

  const { data: achievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => api.getAchievements(),
  });

  if (isLoading || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <OwlMascot expression="thinking" className="w-20 h-20 animate-pulse mb-3" />
        <span className="font-extrabold duo-text-secondary text-sm tracking-wider">LOADING PROFILE...</span>
      </div>
    );
  }

  const maxXpInChart = Math.max(1, ...(profile.weekly_xp_chart?.map((c) => c.xp) || [10]));

  return (
    <div className="pb-16 select-none max-w-xl mx-auto space-y-8">
      {/* 1. Header Card */}
      <div className="flex items-center gap-5 p-6 rounded-3xl border-2 duo-border duo-bg-surface">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center font-black text-white text-3xl shadow-md shrink-0"
          style={{ backgroundColor: profile.avatar_color }}
        >
          {profile.display_name.charAt(0)}
        </div>

        <div>
          <h1 className="text-2xl font-black duo-text-primary">{profile.display_name}</h1>
          <p className="text-xs font-bold duo-text-secondary">@{profile.username}</p>
          <div className="flex items-center gap-2 mt-2 text-xs font-bold duo-text-muted">
            <span>🇪🇸 Spanish</span>
            <span>•</span>
            <span>Joined {profile.joined_date}</span>
          </div>
        </div>
      </div>

      {/* 2. Statistics Grid (2x2) */}
      <div>
        <h2 className="text-lg font-black duo-text-primary uppercase tracking-wider mb-4">Statistics</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Day Streak */}
          <div className="p-4 rounded-2xl border-2 duo-border duo-bg-surface flex items-center gap-3">
            <FlameIcon className="w-9 h-9" active={profile.day_streak > 0} />
            <div>
              <span className="text-lg font-black duo-text-primary">{profile.day_streak}</span>
              <p className="text-xs font-bold duo-text-secondary">Day Streak</p>
            </div>
          </div>

          {/* Total XP */}
          <div className="p-4 rounded-2xl border-2 duo-border duo-bg-surface flex items-center gap-3">
            <BoltIcon className="w-9 h-9" />
            <div>
              <span className="text-lg font-black duo-text-primary">{profile.total_xp}</span>
              <p className="text-xs font-bold duo-text-secondary">Total XP</p>
            </div>
          </div>

          {/* Current League */}
          <div className="p-4 rounded-2xl border-2 duo-border duo-bg-surface flex items-center gap-3">
            <ShieldIcon tier={1} className="w-9 h-9" />
            <div>
              <span className="text-lg font-black duo-text-primary">{profile.current_league}</span>
              <p className="text-xs font-bold duo-text-secondary">Current League</p>
            </div>
          </div>

          {/* Top 3 Finishes */}
          <div className="p-4 rounded-2xl border-2 duo-border duo-bg-surface flex items-center gap-3">
            <TrophyIcon className="w-9 h-9" />
            <div>
              <span className="text-lg font-black duo-text-primary">{profile.top_3_finishes}</span>
              <p className="text-xs font-bold duo-text-secondary">Top 3 Finishes</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Weekly XP 7-Day Chart */}
      {profile.weekly_xp_chart && (
        <div className="p-5 rounded-2xl border-2 duo-border duo-bg-surface">
          <h3 className="text-sm font-extrabold uppercase duo-text-primary mb-4">Last 7 Days XP</h3>

          <div className="flex items-end justify-between h-28 pt-4 px-2">
            {profile.weekly_xp_chart.map((day) => {
              const heightPercent = Math.max(10, (day.xp / maxXpInChart) * 100);

              return (
                <div key={day.date} className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-[10px] font-black duo-text-secondary">{day.xp}</span>
                  <div className="w-6 duo-bg-subtle rounded-t-lg h-20 flex items-end">
                    <div
                      className="w-full bg-feather rounded-t-lg transition-all duration-500"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold duo-text-muted">{day.day_name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Achievements Showcase */}
      {achievements && (
        <div>
          <h2 className="text-lg font-black duo-text-primary uppercase tracking-wider mb-4">
            Achievements
          </h2>

          <div className="space-y-4">
            {achievements.achievements.map((ach: any) => {
              const isMax = ach.current_tier === ach.max_tier;
              const nextThresh = ach.next_threshold || 1;
              const percent = isMax ? 100 : Math.min(100, (ach.current_value / nextThresh) * 100);

              return (
                <div
                  key={ach.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border-2 duo-border duo-bg-surface"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2"
                    style={{
                      borderColor: ach.color_hex,
                      backgroundColor: `${ach.color_hex}15`,
                    }}
                  >
                    <CrownIcon className="w-8 h-8" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-black text-base duo-text-primary">
                        {ach.title} — Level {ach.current_tier}
                      </h4>
                      <span className="text-xs font-bold duo-text-secondary">
                        {ach.current_value} / {isMax ? 'MAX' : nextThresh}
                      </span>
                    </div>

                    <ProgressBar progress={percent} color="bee" />
                    <p className="text-xs font-bold duo-text-secondary mt-1">{ach.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
