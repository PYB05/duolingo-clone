'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { BoltIcon, FlameIcon, GemIcon, HeartIcon } from '../icons';
import { Button } from '../ui/Button';
import { Flag } from '../ui/Flag';

export function TopStatsBar() {
  const { data: user, refetch } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.getMe(),
  });

  const [activePopover, setActivePopover] = useState<'streak' | 'gems' | 'hearts' | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (user?.next_heart_in_seconds) {
      setSecondsLeft(user.next_heart_in_seconds);
    } else {
      setSecondsLeft(null);
    }
  }, [user?.next_heart_in_seconds]);

  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev && prev > 1) return prev - 1;
        refetch();
        return null;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft, refetch]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!user) return null;

  return (
    <div className="w-full flex items-center justify-center gap-2 sm:gap-3 py-2 px-1 select-none">
      {/* 1. Course Flag */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] cursor-pointer transition-colors shrink-0">
        <Flag country="ES" className="w-6 h-4.5 rounded object-cover shadow-sm" />
        <span className="text-xs font-black uppercase text-[#777777] dark:text-[#829BA8] tracking-wider">
          SPANISH
        </span>
      </div>

      {/* 2. Streak Item */}
      <div className="relative shrink-0">
        <button
          onClick={() => setActivePopover(activePopover === 'streak' ? null : 'streak')}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] transition-colors"
        >
          <FlameIcon
            className="w-6 h-6"
            active={user.displayed_streak > 0 || user.current_streak > 0}
          />
          <span
            className={`font-black text-sm leading-none ${
              user.displayed_streak > 0 || user.current_streak > 0
                ? 'text-[#FF9600]'
                : 'text-[#777777] dark:text-[#829BA8]'
            }`}
          >
            {user.displayed_streak > 0 ? user.displayed_streak : user.current_streak}
          </span>
        </button>

        {/* Streak Popover */}
        {activePopover === 'streak' && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-64 bg-white dark:bg-[#202F36] border-2 border-[#E5E5E5] dark:border-[#37464F] rounded-2xl shadow-xl p-4 text-center z-50 animate-in fade-in zoom-in-95">
            <div className="flex justify-center mb-2">
              <FlameIcon
                className="w-14 h-14"
                active={user.displayed_streak > 0 || user.current_streak > 0}
              />
            </div>
            <h3 className="font-extrabold text-lg text-[#3C3C3C] dark:text-[#F1F7FB]">
              {user.displayed_streak > 0 ? user.displayed_streak : user.current_streak} Day Streak!
            </h3>
            <p className="text-xs text-[#777777] dark:text-[#829BA8] mt-1 mb-3">
              {user.is_streak_extended_today
                ? "You've extended your streak today! Keep going tomorrow."
                : 'Complete a lesson today to keep your streak alive!'}
            </p>
            <div className="flex justify-between items-center text-xs text-[#777777] dark:text-[#829BA8] py-2 border-t border-[#E5E5E5] dark:border-[#37464F]">
              <span>Longest Streak</span>
              <span className="font-bold text-[#3C3C3C] dark:text-[#F1F7FB]">{user.longest_streak} days</span>
            </div>
            <div className="flex justify-between items-center text-xs text-[#777777] dark:text-[#829BA8] py-1">
              <span>Streak Freezes</span>
              <span className="font-bold text-[#1CB0F6]">{user.streak_freezes} equipped</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Gems Item */}
      <div className="relative shrink-0">
        <button
          onClick={() => setActivePopover(activePopover === 'gems' ? null : 'gems')}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] transition-colors"
        >
          <GemIcon className="w-6 h-6" />
          <span className="font-black text-sm text-[#1CB0F6] leading-none">{user.gems}</span>
        </button>

        {/* Gems Popover */}
        {activePopover === 'gems' && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-64 bg-white dark:bg-[#202F36] border-2 border-[#E5E5E5] dark:border-[#37464F] rounded-2xl shadow-xl p-4 text-center z-50 animate-in fade-in zoom-in-95">
            <div className="flex justify-center mb-2">
              <GemIcon className="w-12 h-12" />
            </div>
            <h3 className="font-extrabold text-lg text-[#3C3C3C] dark:text-[#F1F7FB]">{user.gems} Gems</h3>
            <p className="text-xs text-[#777777] dark:text-[#829BA8] mt-1 mb-4">
              Earn gems from quests, achievements, and chests. Spend them in the shop!
            </p>
            <Link href="/shop" onClick={() => setActivePopover(null)}>
              <Button variant="blue" size="sm" fullWidth>
                GO TO SHOP
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* 4. Hearts Item */}
      <div className="relative shrink-0">
        <button
          onClick={() => setActivePopover(activePopover === 'hearts' ? null : 'hearts')}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] transition-colors"
        >
          <HeartIcon className="w-6 h-6" active={user.hearts > 0} />
          <span
            className={`font-black text-sm leading-none ${
              user.hearts > 0 ? 'text-[#FF4B4B]' : 'text-[#777777] dark:text-[#829BA8]'
            }`}
          >
            {user.hearts}
          </span>
        </button>

        {/* Hearts Popover */}
        {activePopover === 'hearts' && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 bg-white dark:bg-[#202F36] border-2 border-[#E5E5E5] dark:border-[#37464F] rounded-2xl shadow-xl p-4 text-center z-50 animate-in fade-in zoom-in-95">
            <div className="flex justify-center mb-2">
              <HeartIcon className="w-12 h-12" active={user.hearts > 0} />
            </div>
            <h3 className="font-extrabold text-lg text-[#3C3C3C] dark:text-[#F1F7FB]">
              {user.hearts === 5 ? 'Full Hearts!' : `${user.hearts} / 5 Hearts`}
            </h3>
            {secondsLeft !== null && user.hearts < 5 ? (
              <p className="text-xs font-bold text-[#FF4B4B] mt-1 mb-3">
                Next heart in {formatTimer(secondsLeft)}
              </p>
            ) : (
              <p className="text-xs text-[#777777] dark:text-[#829BA8] mt-1 mb-3">
                Hearts protect you from lesson failure.
              </p>
            )}

            <div className="space-y-2 mt-3">
              <Link href="/practice" onClick={() => setActivePopover(null)}>
                <Button variant="secondary" size="sm" fullWidth>
                  PRACTICE TO EARN HEARTS
                </Button>
              </Link>
              {user.hearts < 5 && (
                <Link href="/shop" onClick={() => setActivePopover(null)}>
                  <Button variant="primary" size="sm" fullWidth>
                    REFILL (350 💎)
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 5. XP Item (Matched with other stat items) */}
      <div className="relative shrink-0">
        <Link
          href="/leaderboard"
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] transition-colors"
        >
          <BoltIcon className="w-6 h-6" />
          <span className="font-black text-sm text-[#FFC800] leading-none">
            {user.total_xp}
          </span>
        </Link>
      </div>
    </div>
  );
}
