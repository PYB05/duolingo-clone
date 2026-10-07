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
      <div className="bg-[#131F24] border-2 border-[#37464F] p-6 sm:p-7 rounded-3xl shadow-lg flex items-center justify-between gap-4">
        <div className="flex-1">
          <span className="text-xs font-black uppercase text-[#CE82FF] tracking-widest block mb-1">
            DEBUG & SETTINGS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F1F7FB] mb-2 leading-tight">
            Developer Sandbox
          </h1>
          <div className="relative inline-block bg-[#202F36] border-2 border-[#37464F] px-4 py-2.5 rounded-2xl text-xs font-extrabold text-[#DCE6EC] leading-snug">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[8px] border-r-[#37464F]" />
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

      {/* 2. Duolingo Live Stats Grid with Inset 3D Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Streak Card */}
        <div
          onClick={() => sfx.play('streak')}
          className="p-4 rounded-2xl border-2 border-[#37464F] hover:border-[#FF9600] bg-[#131F24] hover:bg-[#202F36]/60 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#FF9600]/15 border-2 border-b-4 border-[#FF9600]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FlameIcon className="w-5 h-5 text-[#FF9600]" active />
            </div>
            <span className="text-[10px] font-black text-[#FF9600] bg-[#FF9600]/15 px-2 py-0.5 rounded-full">
              STREAK
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-[#F1F7FB]">
              {user?.displayed_streak ?? 0}{' '}
              <span className="text-xs font-black text-[#829BA8] uppercase">days</span>
            </div>
            <div className="text-[11px] text-[#829BA8] font-bold mt-1">
              Offset: <span className="text-[#F1F7FB]">{settings?.debug_day_offset ?? user?.settings?.debug_day_offset ?? 0}d</span>
            </div>
          </div>
        </div>

        {/* Hearts Card */}
        <div
          onClick={() => sfx.play('tap')}
          className="p-4 rounded-2xl border-2 border-[#37464F] hover:border-[#FF4B4B] bg-[#131F24] hover:bg-[#202F36]/60 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#FF4B4B]/15 border-2 border-b-4 border-[#FF4B4B]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PracticeHeart3D className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-[#FF4B4B] bg-[#FF4B4B]/15 px-2 py-0.5 rounded-full">
              {user?.hearts === 5 ? 'FULL' : 'REGEN'}
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-[#FF4B4B]">
              {user?.hearts ?? 5}{' '}
              <span className="text-xs font-black text-[#829BA8]">/ 5</span>
            </div>
            <div className="text-[11px] text-[#829BA8] font-bold mt-1">
              Lazy auto-regen
            </div>
          </div>
        </div>

        {/* Gems Card */}
        <div
          onClick={() => sfx.play('correct')}
          className="p-4 rounded-2xl border-2 border-[#37464F] hover:border-[#1CB0F6] bg-[#131F24] hover:bg-[#202F36]/60 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#1CB0F6]/15 border-2 border-b-4 border-[#1CB0F6]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GemIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-[#1CB0F6] bg-[#1CB0F6]/15 px-2 py-0.5 rounded-full">
              GEMS
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-[#1CB0F6]">
              {user?.gems ?? 0}
            </div>
            <div className="text-[11px] text-[#829BA8] font-bold mt-1">
              Store balance
            </div>
          </div>
        </div>

        {/* XP Card */}
        <div
          onClick={() => sfx.play('fanfare')}
          className="p-4 rounded-2xl border-2 border-[#37464F] hover:border-[#FFC800] bg-[#131F24] hover:bg-[#202F36]/60 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#FFC800]/15 border-2 border-b-4 border-[#FFC800]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PracticeStar3D className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-[#FFC800] bg-[#FFC800]/15 px-2 py-0.5 rounded-full">
              TOTAL XP
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-[#FFC800]">
              {user?.total_xp ?? 0}{' '}
              <span className="text-xs font-black text-[#829BA8]">XP</span>
            </div>
            <div className="text-[11px] text-[#829BA8] font-bold mt-1">
              Sapphire league
            </div>
          </div>
        </div>
      </div>

      {/* 3. Section Filter Tabs (Duolingo Pill Tabs) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'time', label: 'Time Travel', icon: '⏰' },
          { id: 'hearts', label: 'Hearts & Energy', icon: '❤️' },
          { id: 'currency', label: 'Currencies & XP', icon: '💎' },
          { id: 'course', label: 'Course & Reset', icon: '⚙️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sfx.play('tap');
              setActiveTab(tab.id as any);
            }}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider whitespace-nowrap transition-all border-2 border-b-4 ${
              activeTab === tab.id
                ? 'bg-[#1CB0F6] border-[#1899D6] text-white'
                : 'bg-[#131F24] border-[#37464F] text-[#829BA8] hover:text-[#F1F7FB] hover:border-[#52656F]'
            }`}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Duolingo-Styled Control Cards */}
      <div className="space-y-4">
        {/* Time Travel Section */}
        {(activeTab === 'time' || activeTab === undefined) && (
          <div className="bg-[#131F24] border-2 border-[#37464F] rounded-3xl p-6 shadow-md space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1CB0F6]/15 border-2 border-b-4 border-[#1CB0F6]/30 flex items-center justify-center text-xl">
                  ⏰
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#F1F7FB]">Simulate Virtual Clock</h2>
                  <p className="text-xs font-bold text-[#829BA8]">
                    Advance days to test streak freezes, missed days, and weekly league rollovers.
                  </p>
                </div>
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
                <span>⏩ +1 Day (Tomorrow)</span>
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => timeTravelMutation.mutate(2)}
                disabled={timeTravelMutation.isPending}
                className="w-full uppercase tracking-wider font-black flex items-center justify-center gap-2 border-[#FF9600] text-[#FF9600] hover:bg-[#FF9600]/10"
              >
                <span>❄️ +2 Days (Test Freeze)</span>
              </Button>

              <Button
                variant="blue"
                size="md"
                onClick={() => timeTravelMutation.mutate(7)}
                disabled={timeTravelMutation.isPending}
                className="w-full uppercase tracking-wider font-black flex items-center justify-center gap-2"
              >
                <span>🏆 +7 Days (League Reset)</span>
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => timeTravelMutation.mutate(-1)}
                disabled={timeTravelMutation.isPending}
                className="w-full uppercase tracking-wider font-black flex items-center justify-center gap-2"
              >
                <span>⏪ -1 Day (Yesterday)</span>
              </Button>
            </div>
          </div>
        )}

        {/* Hearts Section */}
        {(activeTab === 'hearts' || activeTab === undefined) && (
          <div className="bg-[#131F24] border-2 border-[#37464F] rounded-3xl p-6 shadow-md space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF4B4B]/15 border-2 border-b-4 border-[#FF4B4B]/30 flex items-center justify-center text-xl">
                ❤️
              </div>
              <div>
                <h2 className="text-lg font-black text-[#F1F7FB]">Hearts Sandbox</h2>
                <p className="text-xs font-bold text-[#829BA8]">
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
                className="w-full uppercase tracking-wider font-black text-xs"
              >
                💔 0 (Empty)
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => setHeartsMutation.mutate(1)}
                disabled={setHeartsMutation.isPending}
                className="w-full uppercase tracking-wider font-black text-xs"
              >
                1 Heart
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => setHeartsMutation.mutate(3)}
                disabled={setHeartsMutation.isPending}
                className="w-full uppercase tracking-wider font-black text-xs"
              >
                3 Hearts
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => setHeartsMutation.mutate(5)}
                disabled={setHeartsMutation.isPending}
                className="w-full uppercase tracking-wider font-black text-xs"
              >
                💖 5 (Full)
              </Button>
            </div>
          </div>
        )}

        {/* Currency Section */}
        {(activeTab === 'currency' || activeTab === undefined) && (
          <div className="bg-[#131F24] border-2 border-[#37464F] rounded-3xl p-6 shadow-md space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFC800]/15 border-2 border-b-4 border-[#FFC800]/30 flex items-center justify-center text-xl">
                💎
              </div>
              <div>
                <h2 className="text-lg font-black text-[#F1F7FB]">Currencies & XP Progression</h2>
                <p className="text-xs font-bold text-[#829BA8]">
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
                className="w-full uppercase tracking-wider font-black text-xs"
              >
                ⚡ +50 XP
              </Button>

              <Button
                variant="blue"
                size="md"
                onClick={() => addXpMutation.mutate(250)}
                disabled={addXpMutation.isPending}
                className="w-full uppercase tracking-wider font-black text-xs"
              >
                🚀 +250 XP
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => addGemsMutation.mutate(100)}
                disabled={addGemsMutation.isPending}
                className="w-full uppercase tracking-wider font-black text-xs text-[#1CB0F6] border-[#1CB0F6]/40 hover:border-[#1CB0F6]"
              >
                💎 +100 Gems
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => addGemsMutation.mutate(500)}
                disabled={addGemsMutation.isPending}
                className="w-full uppercase tracking-wider font-black text-xs text-[#1CB0F6] border-[#1CB0F6]/40 hover:border-[#1CB0F6]"
              >
                💎 +500 Gems
              </Button>
            </div>
          </div>
        )}

        {/* Course & Reset Section */}
        {(activeTab === 'course' || activeTab === undefined) && (
          <div className="bg-[#131F24] border-2 border-[#37464F] rounded-3xl p-6 shadow-md space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#CE82FF]/15 border-2 border-b-4 border-[#CE82FF]/30 flex items-center justify-center text-xl">
                ⚙️
              </div>
              <div>
                <h2 className="text-lg font-black text-[#F1F7FB]">Curriculum & Database Reset</h2>
                <p className="text-xs font-bold text-[#829BA8]">
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
                className="w-full uppercase tracking-wider font-black flex items-center justify-center gap-2 border-[#CE82FF] text-[#CE82FF] hover:bg-[#CE82FF]/10"
              >
                <span>🔓 Unlock All Skills</span>
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
                className="w-full uppercase tracking-wider font-black flex items-center justify-center gap-2 text-[#FF4B4B] border-[#FF4B4B]/40 hover:border-[#FF4B4B] hover:bg-[#FF4B4B]/10"
              >
                <span>🔄 Reset Database</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Character Squad Showcase */}
      <div className="p-6 rounded-3xl border-2 border-[#37464F] bg-[#131F24] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase text-[#829BA8] tracking-widest">
            Learning Pals
          </span>
        </div>
        <div className="flex items-center -space-x-2">
          <CharacterAvatar character="duo" mood="happy" size="sm" className="border-2 border-[#131F24] rounded-full" />
          <CharacterAvatar character="lily" mood="happy" size="sm" className="border-2 border-[#131F24] rounded-full" />
          <CharacterAvatar character="bea" mood="happy" size="sm" className="border-2 border-[#131F24] rounded-full" />
          <CharacterAvatar character="junior" mood="happy" size="sm" className="border-2 border-[#131F24] rounded-full" />
        </div>
      </div>
    </div>
  );
}

