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
import { OwlMascot } from '@/components/mascot/OwlMascot';

export default function DevToolsPage() {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [mascotMood, setMascotMood] = useState<'happy' | 'celebrating' | 'thinking'>('happy');

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
    <div className="max-w-3xl mx-auto py-8 px-4 select-none pb-24 space-y-6">
      {/* 1. Interactive Header Banner with Animated Mascot */}
      <div className="bg-[#131F24] border-2 border-[#37464F] p-6 sm:p-7 rounded-3xl shadow-xl relative overflow-hidden flex items-center justify-between gap-4">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#CE82FF]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#58CC02] animate-ping" />
            <span className="text-xs font-black uppercase text-[#CE82FF] tracking-widest block">
              DEBUG & DEMO SANDBOX
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F1F7FB] mb-2 leading-tight">
            Developer Tools
          </h1>
          <p className="text-sm font-bold text-[#829BA8] max-w-md leading-relaxed">
            Test streak logic, simulate lazy heart regeneration, grant currency, and travel across time in real time.
          </p>
        </div>

        {/* Interactive Animated Mascot */}
        <div
          onClick={() => {
            sfx.play('tap');
            setMascotMood((prev) => (prev === 'happy' ? 'celebrating' : prev === 'celebrating' ? 'thinking' : 'happy'));
          }}
          className="shrink-0 cursor-pointer transition-transform hover:scale-110 active:scale-95 relative z-10 hidden sm:block"
          title="Click Duo to cheer!"
        >
          <OwlMascot expression={mascotMood} className="w-24 h-24 drop-shadow-xl" />
        </div>
      </div>

      {/* Floating Animated Feedback Toast */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1CB0F6] to-[#0284C7] text-white font-black text-sm shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3 duration-200 border-2 border-white/20">
          <div className="flex items-center gap-2">
            <span className="text-base">✨</span>
            <span>{feedback}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Interactive Animated Live State Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Streak Card */}
        <div
          onClick={() => sfx.play('streak')}
          className="p-5 rounded-3xl border-2 border-[#FF9600]/40 bg-gradient-to-br from-[#2D1A0E] via-[#1F140D] to-[#131F24] hover:border-[#FF9600] hover:shadow-[0_0_25px_rgba(255,150,0,0.3)] hover:-translate-y-1 transition-all duration-200 cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-black text-[#FF9600] uppercase tracking-wider">
              <div className="animate-flame">
                <FlameIcon className="w-5 h-5 text-[#FF9600]" active />
              </div>
              <span>Streak</span>
            </div>
            <span className="text-[10px] font-black text-[#FF9600] bg-[#FF9600]/15 px-2 py-0.5 rounded-full border border-[#FF9600]/30">
              ACTIVE
            </span>
          </div>
          <div className="text-3xl font-black text-[#F1F7FB] group-hover:scale-105 transition-transform origin-left">
            {user?.displayed_streak ?? 0}{' '}
            <span className="text-xs font-black text-[#FF9600] tracking-wider uppercase">days</span>
          </div>
          <div className="text-[11px] text-[#829BA8] font-bold mt-1.5 flex items-center gap-1">
            <span>📅 Day Offset:</span>
            <span className="font-extrabold text-[#F1F7FB]">
              {settings?.debug_day_offset ?? user?.settings?.debug_day_offset ?? 0}d
            </span>
          </div>
        </div>

        {/* Hearts Card */}
        <div
          onClick={() => sfx.play('tap')}
          className="p-5 rounded-3xl border-2 border-[#FF4B4B]/40 bg-gradient-to-br from-[#2D0E12] via-[#1F0D10] to-[#131F24] hover:border-[#FF4B4B] hover:shadow-[0_0_25px_rgba(255,75,75,0.3)] hover:-translate-y-1 transition-all duration-200 cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-black text-[#FF4B4B] uppercase tracking-wider">
              <div className="animate-heart-pulse">
                <PracticeHeart3D className="w-5 h-5" />
              </div>
              <span>Hearts</span>
            </div>
            <span className="text-[10px] font-black text-[#FF4B4B] bg-[#FF4B4B]/15 px-2 py-0.5 rounded-full border border-[#FF4B4B]/30">
              {user?.hearts === 5 ? 'FULL' : 'REGEN'}
            </span>
          </div>
          <div className="text-3xl font-black text-[#FF4B4B] group-hover:scale-105 transition-transform origin-left">
            {user?.hearts ?? 5}{' '}
            <span className="text-sm font-black text-[#829BA8]">/ 5</span>
          </div>
          <div className="text-[11px] text-[#829BA8] font-bold mt-1.5 flex items-center gap-1">
            <span>⏱️</span>
            <span className="truncate">Auto-regens lazily</span>
          </div>
        </div>

        {/* Gems Card */}
        <div
          onClick={() => sfx.play('correct')}
          className="p-5 rounded-3xl border-2 border-[#1CB0F6]/40 bg-gradient-to-br from-[#0E232D] via-[#0D191F] to-[#131F24] hover:border-[#1CB0F6] hover:shadow-[0_0_25px_rgba(28,176,246,0.3)] hover:-translate-y-1 transition-all duration-200 cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-black text-[#1CB0F6] uppercase tracking-wider">
              <div className="animate-duo-bob">
                <GemIcon className="w-5 h-5" />
              </div>
              <span>Gems</span>
            </div>
            <span className="text-[10px] font-black text-[#1CB0F6] bg-[#1CB0F6]/15 px-2 py-0.5 rounded-full border border-[#1CB0F6]/30">
              💎 SHOP
            </span>
          </div>
          <div className="text-3xl font-black text-[#1CB0F6] group-hover:scale-105 transition-transform origin-left">
            {user?.gems ?? 0}
          </div>
          <div className="text-[11px] text-[#829BA8] font-bold mt-1.5 flex items-center gap-1">
            <span>🛒 Usable in store</span>
          </div>
        </div>

        {/* XP Card */}
        <div
          onClick={() => sfx.play('fanfare')}
          className="p-5 rounded-3xl border-2 border-[#FFC800]/40 bg-gradient-to-br from-[#2D280E] via-[#1F1C0D] to-[#131F24] hover:border-[#FFC800] hover:shadow-[0_0_25px_rgba(255,200,0,0.3)] hover:-translate-y-1 transition-all duration-200 cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-black text-[#FFC800] uppercase tracking-wider">
              <div className="animate-duo-bob">
                <PracticeStar3D className="w-5 h-5" />
              </div>
              <span>Total XP</span>
            </div>
            <span className="text-[10px] font-black text-[#FFC800] bg-[#FFC800]/15 px-2 py-0.5 rounded-full border border-[#FFC800]/30">
              🏆 LEAGUE
            </span>
          </div>
          <div className="text-3xl font-black text-[#FFC800] group-hover:scale-105 transition-transform origin-left">
            {user?.total_xp ?? 0}{' '}
            <span className="text-xs font-black text-[#829BA8] tracking-wider uppercase">XP</span>
          </div>
          <div className="text-[11px] text-[#829BA8] font-bold mt-1.5 flex items-center gap-1">
            <span>⚡ Sapphire rank</span>
          </div>
        </div>
      </div>

      {/* 3. 3D Interactive Sandbox Tool Sections */}
      <div className="space-y-5">
        {/* Time Travel Section */}
        <section className="bg-[#131F24] border-2 border-[#37464F] rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1CB0F6]/15 border-2 border-[#1CB0F6]/40 flex items-center justify-center text-lg">
              ⏰
            </div>
            <div>
              <h2 className="text-lg font-black text-[#F1F7FB]">Simulated Clock (Time Travel)</h2>
              <p className="text-xs font-bold text-[#829BA8] leading-relaxed">
                Advance or rewind virtual time. Test streak preservation, streak freeze equipment, and weekly league rollovers.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => timeTravelMutation.mutate(1)}
              disabled={timeTravelMutation.isPending}
              className="px-4 py-3 rounded-2xl bg-[#202F36] hover:bg-[#2B3B44] active:scale-95 border-2 border-b-4 border-[#37464F] hover:border-[#1CB0F6] text-[#F1F7FB] font-black text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
            >
              <span>⏩ +1 DAY (TOMORROW)</span>
            </button>

            <button
              onClick={() => timeTravelMutation.mutate(2)}
              disabled={timeTravelMutation.isPending}
              className="px-4 py-3 rounded-2xl bg-[#202F36] hover:bg-[#2B3B44] active:scale-95 border-2 border-b-4 border-[#37464F] hover:border-[#FF9600] text-[#F1F7FB] font-black text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
            >
              <span>❄️ +2 DAYS (MISS A DAY)</span>
            </button>

            <button
              onClick={() => timeTravelMutation.mutate(7)}
              disabled={timeTravelMutation.isPending}
              className="px-4 py-3 rounded-2xl bg-[#202F36] hover:bg-[#2B3B44] active:scale-95 border-2 border-b-4 border-[#37464F] hover:border-[#FFC800] text-[#F1F7FB] font-black text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
            >
              <span>🏆 +7 DAYS (LEAGUE ROLLOVER)</span>
            </button>

            <button
              onClick={() => timeTravelMutation.mutate(-1)}
              disabled={timeTravelMutation.isPending}
              className="px-4 py-3 rounded-2xl bg-transparent hover:bg-[#202F36] active:scale-95 border-2 border-[#37464F] text-[#829BA8] hover:text-[#F1F7FB] font-black text-xs uppercase tracking-wider transition-all"
            >
              <span>⏪ -1 DAY (YESTERDAY)</span>
            </button>
          </div>
        </section>

        {/* Hearts Sandbox */}
        <section className="bg-[#131F24] border-2 border-[#37464F] rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF4B4B]/15 border-2 border-[#FF4B4B]/40 flex items-center justify-center text-lg">
              ❤️
            </div>
            <div>
              <h2 className="text-lg font-black text-[#F1F7FB]">Hearts Sandbox</h2>
              <p className="text-xs font-bold text-[#829BA8] leading-relaxed">
                Simulate heart depletion, test the "Out of Hearts" dialog, and verify practice session recovery.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setHeartsMutation.mutate(0)}
              disabled={setHeartsMutation.isPending}
              className="px-4 py-3 rounded-2xl bg-[#FF4B4B] hover:bg-[#E51E1E] active:scale-95 border-2 border-b-4 border-[#B80000] text-white font-black text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              💔 SET 0 HEARTS (EMPTY)
            </button>

            <button
              onClick={() => setHeartsMutation.mutate(1)}
              disabled={setHeartsMutation.isPending}
              className="px-4 py-3 rounded-2xl bg-[#202F36] hover:bg-[#2B3B44] active:scale-95 border-2 border-b-4 border-[#37464F] hover:border-[#FF4B4B] text-[#F1F7FB] font-black text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              SET 1 HEART
            </button>

            <button
              onClick={() => setHeartsMutation.mutate(3)}
              disabled={setHeartsMutation.isPending}
              className="px-4 py-3 rounded-2xl bg-[#202F36] hover:bg-[#2B3B44] active:scale-95 border-2 border-b-4 border-[#37464F] hover:border-[#FF4B4B] text-[#F1F7FB] font-black text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              SET 3 HEARTS
            </button>

            <button
              onClick={() => setHeartsMutation.mutate(5)}
              disabled={setHeartsMutation.isPending}
              className="px-4 py-3 rounded-2xl bg-[#58CC02] hover:bg-[#4BB302] active:scale-95 border-2 border-b-4 border-[#358000] text-white font-black text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              💖 SET 5 HEARTS (FULL)
            </button>
          </div>
        </section>

        {/* Currency & XP Injection */}
        <section className="bg-[#131F24] border-2 border-[#37464F] rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFC800]/15 border-2 border-[#FFC800]/40 flex items-center justify-center text-lg">
              💎
            </div>
            <div>
              <h2 className="text-lg font-black text-[#F1F7FB]">Currencies & XP Progression</h2>
              <p className="text-xs font-bold text-[#829BA8] leading-relaxed">
                Instantly grant XP to test leaderboard promotion zones, or inject gems to test power-up purchases.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => addXpMutation.mutate(50)}
              disabled={addXpMutation.isPending}
              className="px-4 py-3 rounded-2xl bg-[#1CB0F6] hover:bg-[#1899D6] active:scale-95 border-2 border-b-4 border-[#127AA8] text-white font-black text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              ⚡ +50 XP
            </button>

            <button
              onClick={() => addXpMutation.mutate(250)}
              disabled={addXpMutation.isPending}
              className="px-4 py-3 rounded-2xl bg-[#1CB0F6] hover:bg-[#1899D6] active:scale-95 border-2 border-b-4 border-[#127AA8] text-white font-black text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              🚀 +250 XP
            </button>

            <button
              onClick={() => addGemsMutation.mutate(100)}
              disabled={addGemsMutation.isPending}
              className="px-4 py-3 rounded-2xl bg-[#202F36] hover:bg-[#2B3B44] active:scale-95 border-2 border-b-4 border-[#37464F] hover:border-[#1CB0F6] text-[#1CB0F6] font-black text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              💎 +100 GEMS
            </button>

            <button
              onClick={() => addGemsMutation.mutate(500)}
              disabled={addGemsMutation.isPending}
              className="px-4 py-3 rounded-2xl bg-[#202F36] hover:bg-[#2B3B44] active:scale-95 border-2 border-b-4 border-[#37464F] hover:border-[#1CB0F6] text-[#1CB0F6] font-black text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              💎 +500 GEMS
            </button>
          </div>
        </section>

        {/* Curriculum & Database Reset */}
        <section className="bg-[#131F24] border-2 border-[#37464F] rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#CE82FF]/15 border-2 border-[#CE82FF]/40 flex items-center justify-center text-lg">
              ⚙️
            </div>
            <div>
              <h2 className="text-lg font-black text-[#F1F7FB]">Curriculum & Database Control</h2>
              <p className="text-xs font-bold text-[#829BA8] leading-relaxed">
                Quickly unlock all course units and skills for testing, or reset the SQLite database back to original seed data.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => unlockAllMutation.mutate()}
              disabled={unlockAllMutation.isPending}
              className="px-4 py-3 rounded-2xl bg-[#CE82FF] hover:bg-[#B862F0] active:scale-95 border-2 border-b-4 border-[#9E40D6] text-white font-black text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
            >
              <span>🔓 UNLOCK ALL SKILLS</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset and re-seed the whole database? Current progress will be reset to default.')) {
                  resetMutation.mutate();
                }
              }}
              disabled={resetMutation.isPending}
              className="px-4 py-3 rounded-2xl bg-[#202F36] hover:bg-[#FF4B4B]/20 active:scale-95 border-2 border-b-4 border-[#37464F] hover:border-[#FF4B4B] text-[#FF4B4B] font-black text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
            >
              <span>🔄 RESET DATABASE</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
