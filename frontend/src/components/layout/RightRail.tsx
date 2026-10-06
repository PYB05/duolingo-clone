'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TopStatsBar } from './TopStatsBar';
import {
  SuperBadge,
  SuperFlyingDuo,
  SapphireHexBadge,
  QuestMiniChest,
} from '../icons/WidgetIcons';
import { BoltIcon } from '../icons';

export function RightRail() {
  const railRef = useRef<HTMLElement>(null);
  const [stickyTop, setStickyTop] = useState<number>(16);

  const { data: quests } = useQuery({ queryKey: ['quests'], queryFn: () => api.getQuests() });

  const firstQuest = quests?.daily_quests?.[0] || {
    title: 'Earn 10 XP',
    progress: 0,
    target: 10,
  };

  const questPercent = Math.min(100, (firstQuest.progress / firstQuest.target) * 100);

  useEffect(() => {
    const updateStickyTop = () => {
      if (!railRef.current) return;
      const railHeight = railRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const margin = 20;

      if (railHeight + margin * 2 <= windowHeight) {
        setStickyTop(margin);
      } else {
        setStickyTop(windowHeight - railHeight - margin);
      }
    };

    updateStickyTop();
    window.addEventListener('resize', updateStickyTop);
    const observer = new ResizeObserver(updateStickyTop);
    if (railRef.current) {
      observer.observe(railRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateStickyTop);
      observer.disconnect();
    };
  }, []);

  return (
    <aside
      ref={railRef}
      className="hidden lg:flex flex-col gap-6 w-[370px] shrink-0 select-none pb-4 self-start sticky"
      style={{ top: `${stickyTop}px` }}
    >
      {/* Top stats bar row (perfectly centered) */}
      <div className="w-full">
        <TopStatsBar />
      </div>

      {/* 1. Super Duolingo Promotion Card */}
      <div className="p-6 rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] relative overflow-hidden shadow-lg transition-colors">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <SuperBadge className="h-6 mb-3" />
            <h3 className="font-black text-lg text-[#3C3C3C] dark:text-[#F1F7FB] leading-snug">
              Try Super for free
            </h3>
          </div>
          <div className="shrink-0 -mt-1 -mr-2">
            <SuperFlyingDuo className="w-28 h-24" />
          </div>
        </div>

        <p className="text-sm font-bold text-[#777777] dark:text-[#829BA8] leading-relaxed mb-6">
          No ads, personalized practice, and unlimited Legendary!
        </p>

        <button
          onClick={() => alert('Super Duolingo feature activated!')}
          className="w-full py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] active:scale-98 text-white font-black text-xs uppercase tracking-widest rounded-2xl border-b-4 border-[#3730A3] transition-all shadow-md"
        >
          TRY 1 WEEK FREE
        </button>
      </div>

      {/* 2. Leaderboards Congratulations Card */}
      <div className="p-6 rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] shadow-lg transition-colors">
        <span className="text-xs font-black uppercase text-[#777777] dark:text-[#829BA8] tracking-widest block mb-3">
          LEADERBOARDS
        </span>

        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-black text-lg text-[#3C3C3C] dark:text-[#F1F7FB] mb-1.5">
              Congratulations!
            </h3>
            <p className="text-xs font-bold text-[#777777] dark:text-[#829BA8] leading-relaxed max-w-[190px]">
              You finished #11 and advanced to the Sapphire League
            </p>
          </div>
          <div className="shrink-0">
            <SapphireHexBadge className="w-20 h-20" />
          </div>
        </div>

        <Link href="/leaderboard" className="block w-full">
          <button className="w-full py-3.5 bg-transparent hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] active:scale-98 text-[#1CB0F6] font-black text-xs uppercase tracking-widest rounded-2xl border-2 border-[#E5E5E5] dark:border-[#37464F] transition-all">
            GO TO LEADERBOARDS
          </button>
        </Link>
      </div>

      {/* 3. Daily Quests Card */}
      <div className="p-6 rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] shadow-lg transition-colors">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-lg text-[#3C3C3C] dark:text-[#F1F7FB]">Daily Quests</h3>
          <Link
            href="/quests"
            className="text-xs font-black text-[#1CB0F6] uppercase tracking-wider hover:brightness-125"
          >
            VIEW ALL
          </Link>
        </div>

        <div className="flex items-center gap-3.5">
          {/* Yellow Lightning / Energy Star Icon */}
          <div className="w-14 h-14 rounded-2xl bg-[#F7F7F7] dark:bg-[#131F24] flex items-center justify-center shrink-0 border-2 border-[#E5E5E5] dark:border-[#37464F]">
            <BoltIcon className="w-8 h-8" />
          </div>

          <div className="flex-1">
            <div className="font-black text-sm text-[#3C3C3C] dark:text-[#F1F7FB] mb-2">
              {firstQuest.title}
            </div>

            {/* Inset Progress Track with Floating End Chest */}
            <div className="relative flex items-center">
              <div className="w-full h-5 bg-[#F7F7F7] dark:bg-[#131F24] rounded-full overflow-hidden border-2 border-[#E5E5E5] dark:border-[#37464F] relative">
                <div
                  className="h-full bg-[#FFC800] rounded-full transition-all duration-500"
                  style={{ width: `${questPercent}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#777777] dark:text-[#829BA8]">
                  {firstQuest.progress} / {firstQuest.target}
                </span>
              </div>

              {/* End mini chest badge */}
              <div className="absolute -right-2 -top-1.5 shrink-0 pointer-events-none">
                <QuestMiniChest className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Functional App Navigation Links */}
      <footer className="pt-6 pb-16 flex flex-col items-center gap-3.5 text-center select-none">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] font-black uppercase text-[#777777] dark:text-[#829BA8] tracking-widest">
          <Link href="/practice" className="hover:text-[#3C3C3C] dark:hover:text-[#F1F7FB] transition-colors">PRACTICE</Link>
          <Link href="/leaderboard" className="hover:text-[#3C3C3C] dark:hover:text-[#F1F7FB] transition-colors">LEADERBOARDS</Link>
          <Link href="/quests" className="hover:text-[#3C3C3C] dark:hover:text-[#F1F7FB] transition-colors">QUESTS</Link>
          <Link href="/shop" className="hover:text-[#3C3C3C] dark:hover:text-[#F1F7FB] transition-colors">SHOP</Link>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] font-black uppercase text-[#777777] dark:text-[#829BA8] tracking-widest">
          <Link href="/profile" className="hover:text-[#3C3C3C] dark:hover:text-[#F1F7FB] transition-colors">PROFILE</Link>
          <Link href="/settings" className="hover:text-[#3C3C3C] dark:hover:text-[#F1F7FB] transition-colors">SETTINGS</Link>
          <Link href="/dev" className="hover:text-[#3C3C3C] dark:hover:text-[#F1F7FB] transition-colors">DEV TOOLS</Link>
        </div>
        <div className="text-[10px] font-bold text-[#AFAFAF] dark:text-[#52656D] uppercase tracking-wider pt-2">
          © 2026 DUOLINGO CLONE • SCALER
        </div>
      </footer>
    </aside>
  );
}
