'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { sfx } from '@/lib/sfx';
import {
  FlameIcon,
  PracticeHeart3D,
  GemIcon,
  PracticeStar3D,
} from '@/components/icons';
import { PracticeSpeed3D } from '@/components/icons/PracticeIcons';
import { DuolingoGearIcon } from '@/components/icons/NavIcons';
import { CharacterAvatar } from '@/components/mascot/CharacterAvatar';
import { OwlMascot } from '@/components/mascot/OwlMascot';

export default function DevToolsPage() {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [mascotMood, setMascotMood] = useState<'happy' | 'celebrating' | 'thinking'>('happy');
  const [activeTab, setActiveTab] = useState<'time' | 'hearts' | 'currency' | 'course'>('time');

  const { data: user, refetch: refetchUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.getMe(),
  });

  const { data: settings, refetch: refetchSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  });

  const notify = (msg: string, soundType: 'correct' | 'fanfare' | 'streak' | 'tap' = 'correct') => {
    sfx.play(soundType);
    setMascotMood('celebrating');
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
    setTimeout(() => setMascotMood('happy'), 3000);
    queryClient.invalidateQueries();
  };

  // Mutations
  const timeTravelMutation = useMutation({
    mutationFn: (days: number) => api.devTimeTravel(days),
    onSuccess: (res) => {
      notify(`⏰ ${res.message || 'Time travelled!'}`, 'streak');
      refetchUser();
      refetchSettings();
    },
    onError: (err: any) => alert(err.message),
  });

  const setHeartsMutation = useMutation({
    mutationFn: (hearts: number) => api.devSetHearts(hearts),
    onSuccess: (res) => {
      notify(`❤️ ${res.message || 'Hearts updated!'}`, 'correct');
      refetchUser();
    },
    onError: (err: any) => alert(err.message),
  });

  const addXpMutation = useMutation({
    mutationFn: (amount: number) => api.devAddXp(amount),
    onSuccess: (res) => {
      notify(`⚡ ${res.message || 'XP added!'}`, 'fanfare');
      refetchUser();
    },
    onError: (err: any) => alert(err.message),
  });

  const addGemsMutation = useMutation({
    mutationFn: (amount: number) => api.devAddGems(amount),
    onSuccess: (res) => {
      notify(`💎 ${res.message || 'Gems added!'}`, 'correct');
      refetchUser();
    },
    onError: (err: any) => alert(err.message),
  });

  const unlockAllMutation = useMutation({
    mutationFn: () => api.devUnlockAll(),
    onSuccess: (res) => {
      notify(`🔓 ${res.message || 'All skills unlocked!'}`, 'fanfare');
      queryClient.invalidateQueries({ queryKey: ['course'] });
    },
    onError: (err: any) => alert(err.message),
  });

  const resetMutation = useMutation({
    mutationFn: () => api.devReset(),
    onSuccess: (res) => {
      notify(`🔄 ${res.message || 'Database reset successfully!'}`, 'tap');
      queryClient.invalidateQueries();
    },
    onError: (err: any) => alert(err.message),
  });

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 select-none pb-24 space-y-6">
      {/* 1. Header with Duo Speech Bubble (Authentic Duolingo Vibe) */}
      <div className="bg-white dark:bg-[#131F24] border-2 border-[#E5E5E5] dark:border-[#37464F] p-6 sm:p-7 rounded-3xl shadow-lg flex items-center justify-between gap-4 transition-colors">
        <div className="flex-1">
          <span className="text-xs font-black uppercase text-[#CE82FF] tracking-widest block mb-1">
            DEBUG & SETTINGS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3C3C3C] dark:text-[#F1F7FB] mb-2 leading-tight">
            Developer Sandbox
          </h1>
          <div className="relative inline-block bg-[#F7F7F7] dark:bg-[#202F36] border-2 border-[#E5E5E5] dark:border-[#37464F] px-4 py-2.5 rounded-2xl text-xs font-extrabold text-[#4B4B4B] dark:text-[#DCE6EC] leading-snug">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[8px] border-r-[#E5E5E5] dark:border-r-[#37464F]" />
            <span>Customize stats, simulate lazy hearts, and test streak freeze in real time!</span>
          </div>
        </div>

        {/* Clickable Animated Mascot */}
        <div
          onClick={() => {
            sfx.play('tap');
            setMascotMood((prev) => (prev === 'happy' ? 'celebrating' : prev === 'celebrating' ? 'thinking' : 'happy'));
          }}
          className="shrink-0 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          title="Click Duo to cheer!"
        >
          <OwlMascot expression={mascotMood} className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md" />
        </div>
      </div>

      {/* Floating Animated Feedback Toast */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-[#58CC02] border-2 border-b-4 border-[#46A302] text-white font-black text-sm shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎉</span>
            <span>{feedback}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="w-7 h-7 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-xs text-white font-black"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Unified Duolingo Stats Bar Section */}
      <div className="bg-white dark:bg-[#131F24] border-2 border-[#E5E5E5] dark:border-[#37464F] rounded-3xl p-5 sm:p-6 shadow-lg transition-colors">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase text-[#777777] dark:text-[#829BA8] tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#58CC02] animate-pulse" />
            LIVE METRICS
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Streak Card */}
          <div
            onClick={() => sfx.play('streak')}
            className="p-4 rounded-2xl bg-[#F7F7F7] dark:bg-[#202F36] hover:bg-[#EAEAEA] dark:hover:bg-[#263842] border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] hover:border-[#FF9600] active:translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <FlameIcon className="w-7 h-7 text-[#FF9600] group-hover:scale-110 transition-transform shrink-0 drop-shadow" active />
              <div className="min-w-0">
                <div className="text-[11px] font-black uppercase text-[#FF9600] tracking-wider truncate">Streak</div>
                <div className="text-[10px] font-extrabold text-[#777777] dark:text-[#829BA8] truncate">{settings?.debug_day_offset ?? 0}d offset</div>
              </div>
            </div>
            <div className="pt-2 border-t border-[#E5E5E5] dark:border-[#37464F]/60">
              <div className="text-2xl sm:text-3xl font-black text-[#3C3C3C] dark:text-[#F1F7FB] leading-none">
                {user?.displayed_streak ?? 0}
                <span className="text-xs font-bold text-[#777777] dark:text-[#829BA8] ml-1 uppercase">days</span>
              </div>
            </div>
          </div>

          {/* Hearts Card */}
          <div
            onClick={() => sfx.play('tap')}
            className="p-4 rounded-2xl bg-[#F7F7F7] dark:bg-[#202F36] hover:bg-[#EAEAEA] dark:hover:bg-[#263842] border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] hover:border-[#FF4B4B] active:translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="group-hover:scale-110 transition-transform shrink-0">
                <PracticeHeart3D className="w-7 h-7 drop-shadow" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-black uppercase text-[#FF4B4B] tracking-wider truncate">Hearts</div>
                <div className="text-[10px] font-extrabold text-[#777777] dark:text-[#829BA8] truncate">
                  {user?.hearts === 5 ? 'Max full' : 'Regenerating'}
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-[#E5E5E5] dark:border-[#37464F]/60">
              <div className="text-2xl sm:text-3xl font-black text-[#FF4B4B] leading-none">
                {user?.hearts ?? 5}
                <span className="text-xs font-bold text-[#777777] dark:text-[#829BA8] ml-1">/ 5</span>
              </div>
            </div>
          </div>

          {/* Gems Card */}
          <div
            onClick={() => sfx.play('correct')}
            className="p-4 rounded-2xl bg-[#F7F7F7] dark:bg-[#202F36] hover:bg-[#EAEAEA] dark:hover:bg-[#263842] border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] hover:border-[#1CB0F6] active:translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="group-hover:scale-110 transition-transform shrink-0">
                <GemIcon className="w-7 h-7 drop-shadow" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-black uppercase text-[#1CB0F6] tracking-wider truncate">Gems</div>
                <div className="text-[10px] font-extrabold text-[#777777] dark:text-[#829BA8] truncate">In wallet</div>
              </div>
            </div>
            <div className="pt-2 border-t border-[#E5E5E5] dark:border-[#37464F]/60">
              <div className="text-2xl sm:text-3xl font-black text-[#1CB0F6] leading-none">
                {user?.gems ?? 0}
              </div>
            </div>
          </div>

          {/* XP Card */}
          <div
            onClick={() => sfx.play('fanfare')}
            className="p-4 rounded-2xl bg-[#F7F7F7] dark:bg-[#202F36] hover:bg-[#EAEAEA] dark:hover:bg-[#263842] border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] hover:border-[#FFC800] active:translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="group-hover:scale-110 transition-transform shrink-0">
                <PracticeStar3D className="w-7 h-7 drop-shadow" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-black uppercase text-[#FFC800] tracking-wider truncate">Total XP</div>
                <div className="text-[10px] font-extrabold text-[#777777] dark:text-[#829BA8] truncate">Sapphire</div>
              </div>
            </div>
            <div className="pt-2 border-t border-[#E5E5E5] dark:border-[#37464F]/60">
              <div className="text-2xl sm:text-3xl font-black text-[#FFC800] leading-none">
                {user?.total_xp ?? 0}
                <span className="text-xs font-bold text-[#777777] dark:text-[#829BA8] ml-1">XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Section Filter Tabs (Clean Duolingo 3D Pill Tabs without Scrollbar) */}
      <div className="flex flex-wrap items-center gap-2.5">
        {[
          { id: 'time', label: 'Time Travel', icon: <PracticeSpeed3D className="w-5 h-5" /> },
          { id: 'hearts', label: 'Hearts & Energy', icon: <PracticeHeart3D className="w-5 h-5" /> },
          { id: 'currency', label: 'Currencies & XP', icon: <GemIcon className="w-5 h-5" /> },
          { id: 'course', label: 'Course & Reset', icon: <DuolingoGearIcon className="w-5 h-5" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sfx.play('tap');
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border-2 border-b-4 active:translate-y-0.5 ${
                isActive
                  ? 'bg-[#1CB0F6] border-[#1899D6] text-white shadow-sm'
                  : 'bg-white dark:bg-[#202F36] border-[#E5E5E5] dark:border-[#37464F] text-[#777777] dark:text-[#829BA8] hover:text-[#3C3C3C] dark:hover:text-[#F1F7FB] hover:border-[#CECECE] dark:hover:border-[#52656F]'
              }`}
            >
              <span className="shrink-0">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Seamless Duolingo-Styled Control Cards */}
      <div className="space-y-4">
        {/* Time Travel Section */}
        {(activeTab === 'time' || activeTab === undefined) && (
          <div className="bg-white dark:bg-[#131F24] border-2 border-[#E5E5E5] dark:border-[#37464F] rounded-3xl p-6 shadow-md space-y-4 animate-in fade-in duration-200 transition-colors">
            <div className="flex items-center gap-3">
              <PracticeSpeed3D className="w-10 h-10 shrink-0 drop-shadow" />
              <div>
                <h2 className="text-lg font-black text-[#3C3C3C] dark:text-[#F1F7FB]">Simulate Virtual Clock</h2>
                <p className="text-xs font-bold text-[#777777] dark:text-[#829BA8]">
                  Advance days to test streak freezes, missed days, and weekly league rollovers.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => timeTravelMutation.mutate(1)}
                disabled={timeTravelMutation.isPending}
                className="w-full uppercase tracking-wider font-black flex items-center justify-center gap-2"
              >
                {/* 3D Fast Forward Chevron Icon */}
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0 drop-shadow-sm">
                  <path d="M4 6L11 12L4 18V6Z" fill="#FFFFFF" />
                  <path d="M12 6L19 12L12 18V6Z" fill="#FFFFFF" />
                  <path d="M4 6L11 12L4 18" stroke="#D7FFB8" strokeWidth="1.2" />
                  <path d="M12 6L19 12L12 18" stroke="#D7FFB8" strokeWidth="1.2" />
                </svg>
                <span className="whitespace-nowrap">+1 Day (Tomorrow)</span>
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => timeTravelMutation.mutate(2)}
                disabled={timeTravelMutation.isPending}
                className="w-full uppercase tracking-wider font-black flex items-center justify-center gap-2 border-[#FF9600] text-[#FF9600] hover:bg-[#FF9600]/10"
              >
                {/* 3D Duolingo Ice Snowflake Streak Freeze Icon */}
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0">
                  <path d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M4.93 19.07L19.07 4.93" stroke="#00CD9C" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="3" fill="#79E2FB" stroke="#0284C7" strokeWidth="1" />
                  <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
                </svg>
                <span className="whitespace-nowrap">+2 Days (Freeze)</span>
              </Button>

              <Button
                variant="blue"
                size="md"
                onClick={() => timeTravelMutation.mutate(7)}
                disabled={timeTravelMutation.isPending}
                className="w-full uppercase tracking-wider font-black flex items-center justify-center gap-2"
              >
                {/* 3D Gold Trophy Icon */}
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0 drop-shadow-sm">
                  <path d="M18 4H6C4.9 4 4 4.9 4 6V8C4 10.2 5.8 12 8 12H8.3C8.9 14.3 10.8 16 13 16C15.2 16 17.1 14.3 17.7 12H18C20.2 12 22 10.2 22 8V6C22 4.9 21.1 4 20 4H18Z" fill="#FFC800" stroke="#E59400" strokeWidth="1" />
                  <path d="M6 6H4V8C4 9.1 4.9 10 6 10V6ZM18 6V10C19.1 10 20 9.1 20 8V6H18Z" fill="#FFE082" />
                  <path d="M10 16V19H16V16" stroke="#E59400" strokeWidth="2" strokeLinecap="round" />
                  <rect x="8" y="19" width="10" height="3" rx="1.5" fill="#E59400" />
                  <circle cx="13" cy="9" r="1.5" fill="#FFFFFF" opacity="0.9" />
                </svg>
                <span className="whitespace-nowrap">+7 Days (Reset)</span>
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => timeTravelMutation.mutate(-1)}
                disabled={timeTravelMutation.isPending}
                className="w-full uppercase tracking-wider font-black flex items-center justify-center gap-2"
              >
                {/* 3D Rewind Chevron Icon */}
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0">
                  <path d="M20 6L13 12L20 18V6Z" fill="#1CB0F6" />
                  <path d="M12 6L5 12L12 18V6Z" fill="#1CB0F6" />
                  <path d="M20 6L13 12L20 18" stroke="#0284C7" strokeWidth="1.2" />
                  <path d="M12 6L5 12L12 18" stroke="#0284C7" strokeWidth="1.2" />
                </svg>
                <span className="whitespace-nowrap">-1 Day (Yesterday)</span>
              </Button>
            </div>
          </div>
        )}

        {/* Hearts Section */}
        {(activeTab === 'hearts' || activeTab === undefined) && (
          <div className="bg-white dark:bg-[#131F24] border-2 border-[#E5E5E5] dark:border-[#37464F] rounded-3xl p-6 shadow-md space-y-4 animate-in fade-in duration-200 transition-colors">
            <div className="flex items-center gap-3">
              <PracticeHeart3D className="w-10 h-10 shrink-0 drop-shadow" />
              <div>
                <h2 className="text-lg font-black text-[#3C3C3C] dark:text-[#F1F7FB]">Hearts Sandbox</h2>
                <p className="text-xs font-bold text-[#777777] dark:text-[#829BA8]">
                  Deplete or fill hearts instantly to verify the practice-to-earn recovery loop.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <Button
                variant="danger"
                size="md"
                onClick={() => setHeartsMutation.mutate(0)}
                disabled={setHeartsMutation.isPending}
                className="w-full uppercase tracking-wider font-black text-xs flex items-center justify-center gap-1.5"
              >
                {/* 3D Broken / Depleted Heart Icon */}
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 shrink-0 drop-shadow-sm">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#E51E1E" />
                  <path d="M12 4L10 9L14 13L11 18" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>0 (Empty)</span>
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => setHeartsMutation.mutate(1)}
                disabled={setHeartsMutation.isPending}
                className="w-full uppercase tracking-wider font-black text-xs flex items-center justify-center gap-1.5"
              >
                <PracticeHeart3D className="w-4 h-4 shrink-0" />
                <span>1 Heart</span>
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => setHeartsMutation.mutate(3)}
                disabled={setHeartsMutation.isPending}
                className="w-full uppercase tracking-wider font-black text-xs flex items-center justify-center gap-1.5"
              >
                <PracticeHeart3D className="w-4 h-4 shrink-0" />
                <span>3 Hearts</span>
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => setHeartsMutation.mutate(5)}
                disabled={setHeartsMutation.isPending}
                className="w-full uppercase tracking-wider font-black text-xs flex items-center justify-center gap-1.5"
              >
                <PracticeHeart3D className="w-4 h-4 shrink-0" />
                <span>5 (Full)</span>
              </Button>
            </div>
          </div>
        )}

        {/* Currency Section */}
        {(activeTab === 'currency' || activeTab === undefined) && (
          <div className="bg-white dark:bg-[#131F24] border-2 border-[#E5E5E5] dark:border-[#37464F] rounded-3xl p-6 shadow-md space-y-4 animate-in fade-in duration-200 transition-colors">
            <div className="flex items-center gap-3">
              <GemIcon className="w-10 h-10 shrink-0 drop-shadow" />
              <div>
                <h2 className="text-lg font-black text-[#3C3C3C] dark:text-[#F1F7FB]">Currencies & XP Progression</h2>
                <p className="text-xs font-bold text-[#777777] dark:text-[#829BA8]">
                  Inject gems to test store purchases or grant XP to test leaderboard promotion zones.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <Button
                variant="blue"
                size="md"
                onClick={() => addXpMutation.mutate(50)}
                disabled={addXpMutation.isPending}
                className="w-full uppercase tracking-wider font-black text-xs flex items-center justify-center gap-1.5"
              >
                {/* 3D Glowing Energy Bolt */}
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 shrink-0 drop-shadow-sm">
                  <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" fill="#FFC800" stroke="#E59400" strokeWidth="1" strokeLinejoin="round" />
                  <path d="M12 4L6 13H11L10.5 18L17 11H12L12 4Z" fill="#FFF9C4" opacity="0.8" />
                </svg>
                <span>+50 XP</span>
              </Button>

              <Button
                variant="blue"
                size="md"
                onClick={() => addXpMutation.mutate(250)}
                disabled={addXpMutation.isPending}
                className="w-full uppercase tracking-wider font-black text-xs flex items-center justify-center gap-1.5"
              >
                {/* 3D XP Rocket Booster Icon */}
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 shrink-0 drop-shadow-sm">
                  <path d="M12 2.5C12 2.5 17 5 17 12C17 16 15 19 12 21.5C9 19 7 16 7 12C7 5 12 2.5 12 2.5Z" fill="#FF4B4B" stroke="#B80000" strokeWidth="1" />
                  <circle cx="12" cy="10" r="3" fill="#1CB0F6" stroke="#FFFFFF" strokeWidth="1.2" />
                  <path d="M7 14L4 17L7 18V14Z" fill="#E59400" />
                  <path d="M17 14L20 17L17 18V14Z" fill="#E59400" />
                  <path d="M10 21.5L12 23.5L14 21.5" stroke="#FFC800" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span>+250 XP</span>
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => addGemsMutation.mutate(100)}
                disabled={addGemsMutation.isPending}
                className="w-full uppercase tracking-wider font-black text-xs text-[#1CB0F6] border-[#1CB0F6]/40 hover:border-[#1CB0F6] flex items-center justify-center gap-1.5"
              >
                <GemIcon className="w-4 h-4 shrink-0" />
                <span>+100 Gems</span>
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => addGemsMutation.mutate(500)}
                disabled={addGemsMutation.isPending}
                className="w-full uppercase tracking-wider font-black text-xs text-[#1CB0F6] border-[#1CB0F6]/40 hover:border-[#1CB0F6] flex items-center justify-center gap-1.5"
              >
                <GemIcon className="w-4 h-4 shrink-0" />
                <span>+500 Gems</span>
              </Button>
            </div>
          </div>
        )}

        {/* Course & Reset Section */}
        {(activeTab === 'course' || activeTab === undefined) && (
          <div className="bg-white dark:bg-[#131F24] border-2 border-[#E5E5E5] dark:border-[#37464F] rounded-3xl p-6 shadow-md space-y-4 animate-in fade-in duration-200 transition-colors">
            <div className="flex items-center gap-3">
              <DuolingoGearIcon className="w-10 h-10 shrink-0 drop-shadow" />
              <div>
                <h2 className="text-lg font-black text-[#3C3C3C] dark:text-[#F1F7FB]">Curriculum & Database Reset</h2>
                <p className="text-xs font-bold text-[#777777] dark:text-[#829BA8]">
                  Unlock every skill unit on the learning path or restore default seed state.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => unlockAllMutation.mutate()}
                disabled={unlockAllMutation.isPending}
                className="w-full uppercase tracking-wider font-black flex items-center justify-center gap-2.5 border-[#CE82FF] text-[#CE82FF] hover:bg-[#CE82FF]/10"
              >
                {/* 3D Duolingo Unlocked Gold Padlock Icon */}
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0">
                  <rect x="4" y="10" width="16" height="11" rx="3" fill="#CE82FF" stroke="#A855F7" strokeWidth="1" />
                  <path d="M8 10V6C8 3.79 9.79 2 12 2C14.21 2 16 3.79 16 6" stroke="#CE82FF" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="12" cy="15" r="1.5" fill="#FFFFFF" />
                </svg>
                <span>Unlock All Skills</span>
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  if (window.confirm('Reset and re-seed the whole database? Current progress will be restored to default.')) {
                    resetMutation.mutate();
                  }
                }}
                disabled={resetMutation.isPending}
                className="w-full uppercase tracking-wider font-black flex items-center justify-center gap-2.5 text-[#FF4B4B] border-[#FF4B4B]/40 hover:border-[#FF4B4B] hover:bg-[#FF4B4B]/10"
              >
                {/* 3D Reset / Refresh Circular Arrow Icon */}
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0">
                  <path d="M4 12C4 7.58 7.58 4 12 4C15.37 4 18.28 6.09 19.46 9M20 12C20 16.42 16.42 20 12 20C8.63 20 5.72 17.91 4.54 15" stroke="#FF4B4B" strokeWidth="2.5" strokeLinecap="round" />
                  <polyline points="20 4 20 9 15 9" stroke="#FF4B4B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="4 20 4 15 9 15" stroke="#FF4B4B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Reset Database</span>
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}


