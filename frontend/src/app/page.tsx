'use client';

import React from 'react';
import Link from 'next/link';
import { OwlMascot } from '@/components/mascot/OwlMascot';
import { Button } from '@/components/ui/Button';
import {
  FlameIcon,
  PracticeHeart3D,
  SapphireHexBadge,
  SuperFlyingDuo,
} from '@/components/icons';
import { Flag } from '@/components/ui/Flag';

export default function HomePage() {
  const languages = [
    { name: 'Spanish', code: 'ES', learners: '34M learners' },
    { name: 'French', code: 'FR', learners: '21M learners' },
    { name: 'German', code: 'DE', learners: '14M learners' },
    { name: 'Japanese', code: 'JP', learners: '18M learners' },
    { name: 'Italian', code: 'IT', learners: '9M learners' },
  ];



  return (
    <div className="min-h-screen duo-bg-page duo-text-primary select-none flex flex-col justify-between">
      {/* 1. Header */}
      <header className="border-b-2 duo-border py-4 px-6 sm:px-12 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl font-black tracking-tight text-feather">duolingo</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/learn">
            <Button variant="ghost" size="sm">
              SIGN IN
            </Button>
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 py-12 sm:py-20 flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Owl Mascot Hero with Speech Bubble */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="relative">
              <OwlMascot expression="happy" className="w-64 h-64 sm:w-80 sm:h-80 drop-shadow-2xl" />
              {/* Floating speech bubble */}
              <div className="absolute -top-4 -right-2 sm:-right-8 duo-bg-surface border-2 duo-border rounded-2xl p-3 shadow-md">
                <span className="text-sm font-black duo-text-primary flex items-center gap-2">
                  <span>¡Hola!</span>
                  <span className="text-xs bg-feather/20 text-feather font-black px-2 py-0.5 rounded-full">
                    ESPAÑOL
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Headline & CTA */}
          <div className="flex-1 text-center md:text-left max-w-lg">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black duo-text-primary leading-tight mb-6">
              The free, fun, and effective way to learn a language!
            </h1>

            <div className="flex flex-col gap-3 w-full max-w-sm mx-auto md:mx-0">
              <Link href="/learn" className="w-full">
                <Button variant="primary" size="lg" className="w-full text-base">
                  GET STARTED
                </Button>
              </Link>

              <Link href="/learn" className="w-full">
                <Button variant="secondary" size="lg" className="w-full text-base">
                  I ALREADY HAVE AN ACCOUNT
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 3. Language Selector Ribbon */}
        <section className="border-y-2 duo-border py-6 duo-bg-surface">
          <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {languages.map((lang) => (
              <Link
                key={lang.name}
                href="/learn"
                className="flex items-center gap-3 hover:scale-105 transition-transform"
              >
                <Flag country={lang.code} className="w-9 h-6 shadow-sm" />
                <div className="text-left">
                  <p className="text-xs font-black uppercase duo-text-primary">{lang.name}</p>
                  <p className="text-[10px] font-bold duo-text-secondary">{lang.learners}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Official Duolingo Illustrated Storytelling Feature Showcase */}
        <section className="py-20 sm:py-28 max-w-6xl mx-auto px-6 space-y-24 sm:space-y-36">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-[#58CC02] bg-[#58CC02]/15 px-3.5 py-1.5 rounded-full inline-block mb-3">
              THE DUOLINGO DIFFERENCE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black duo-text-primary tracking-tight">
              Why you&apos;ll love learning with us
            </h2>
          </div>

          {/* Feature 1: free. fun. effective. */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 sm:gap-20">
            <div className="flex-1 flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#58CC02]/10 dark:bg-[#58CC02]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center">
                  <OwlMascot
                    expression="celebrating"
                    className="w-56 h-56 sm:w-64 sm:h-64 drop-shadow-2xl hover:scale-105 transition-transform cursor-pointer"
                  />
                  <div className="absolute -bottom-3 bg-white dark:bg-[#202F36] border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
                    <span className="text-lg">⭐</span>
                    <span className="font-black text-xs uppercase tracking-wider text-[#58CC02]">
                      +50 XP EARNED
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-widest text-[#58CC02] bg-[#58CC02]/15 px-3 py-1 rounded-full mb-3 inline-block">
                GAMIFIED LESSONS
              </span>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#58CC02] lowercase tracking-tight mb-4">
                free. fun. effective.
              </h3>
              <p className="text-base sm:text-lg font-bold duo-text-secondary leading-relaxed max-w-lg">
                Learning with Duolingo is fun, and research shows that it works! With quick, bite-sized lessons, you’ll earn points and unlock new levels while gaining real-world communication skills.
              </p>
            </div>
          </div>

          {/* Feature 2: backed by science. (Reversed) */}
          <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12 sm:gap-20">
            <div className="flex-1 flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#1CB0F6]/10 dark:bg-[#1CB0F6]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center">
                  <OwlMascot
                    expression="thinking"
                    className="w-52 h-52 sm:w-60 sm:h-60 drop-shadow-2xl hover:scale-105 transition-transform cursor-pointer"
                  />
                  <div className="absolute -bottom-3 bg-white dark:bg-[#202F36] border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
                    <SapphireHexBadge className="w-6 h-6" />
                    <span className="font-black text-xs uppercase tracking-wider text-[#1CB0F6]">
                      PROVEN METHOD
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-widest text-[#1CB0F6] bg-[#1CB0F6]/15 px-3 py-1 rounded-full mb-3 inline-block">
                RESEARCH-BACKED
              </span>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1CB0F6] lowercase tracking-tight mb-4">
                backed by science.
              </h3>
              <p className="text-base sm:text-lg font-bold duo-text-secondary leading-relaxed max-w-lg">
                We use a combination of research-backed teaching methods and delightfully engaging content to create courses that effectively teach reading, writing, listening, and speaking skills.
              </p>
            </div>
          </div>

          {/* Feature 3: stay motivated. */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 sm:gap-20">
            <div className="flex-1 flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#FF9600]/10 dark:bg-[#FF9600]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-3xl bg-gradient-to-tr from-[#FF9600]/20 via-[#FF9600]/10 to-transparent border-2 border-[#FF9600]/30 flex items-center justify-center shadow-inner hover:scale-105 transition-transform">
                    <FlameIcon className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-2xl" active />
                  </div>
                  <div className="absolute -bottom-3 bg-white dark:bg-[#202F36] border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] px-5 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF9600] animate-ping" />
                    <span className="font-black text-sm uppercase tracking-wider text-[#FF9600]">
                      7 DAY STREAK!
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-widest text-[#FF9600] bg-[#FF9600]/15 px-3 py-1 rounded-full mb-3 inline-block">
                HABIT FORMATION
              </span>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FF9600] lowercase tracking-tight mb-4">
                stay motivated.
              </h3>
              <p className="text-base sm:text-lg font-bold duo-text-secondary leading-relaxed max-w-lg">
                We make it easy to form a habit of language learning with game-like features, fun challenges, and friendly reminders from our friendly mascot, Duo the Owl.
              </p>
            </div>
          </div>

          {/* Feature 4: personalized learning. (Reversed) */}
          <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12 sm:gap-20">
            <div className="flex-1 flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#FF4B4B]/10 dark:bg-[#FF4B4B]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center">
                  <SuperFlyingDuo className="w-52 h-52 sm:w-64 sm:h-64 drop-shadow-2xl hover:scale-105 transition-transform cursor-pointer" />
                  <div className="absolute -bottom-3 bg-white dark:bg-[#202F36] border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
                    <PracticeHeart3D className="w-5 h-5 drop-shadow" />
                    <span className="font-black text-xs uppercase tracking-wider text-[#FF4B4B]">
                      SMART PRACTICE
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-widest text-[#FF4B4B] bg-[#FF4B4B]/15 px-3 py-1 rounded-full mb-3 inline-block">
                AI ADAPTIVE
              </span>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FF4B4B] lowercase tracking-tight mb-4">
                personalized learning.
              </h3>
              <p className="text-base sm:text-lg font-bold duo-text-secondary leading-relaxed max-w-lg">
                Combining the best of AI and language science, lessons are tailored to help you learn at just the right level and pace, re-testing concepts you found difficult.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Bottom CTA Banner */}
        <section className="bg-feather py-16 px-6 text-center text-white select-none">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Learn a language with Duolingo clone.
            </h2>
            <p className="text-base font-bold text-white/90 max-w-md mb-8">
              Join millions of learners. Practice Spanish today with our interactive lessons, gamified streak engine, and competitive leagues.
            </p>
            <Link href="/learn">
              <button className="bg-white text-feather px-8 py-4 rounded-2xl font-black text-base uppercase tracking-wider border-b-4 border-slate-200 hover:brightness-95 active:border-b-0 active:translate-y-1 transition-all shadow-lg">
                START LEARNING NOW
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* 6. Footer */}
      <footer className="border-t-2 duo-border py-8 px-6 duo-bg-surface text-center text-xs font-bold duo-text-secondary">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Duolingo Clone. Built with Next.js, FastAPI & SQLite.</p>
          <div className="flex gap-6 uppercase tracking-wider text-[11px]">
            <Link href="/learn" className="hover:duo-text-primary">
              Learn
            </Link>
            <Link href="/leaderboard" className="hover:duo-text-primary">
              Leaderboards
            </Link>
            <Link href="/quests" className="hover:duo-text-primary">
              Quests
            </Link>
            <Link href="/shop" className="hover:duo-text-primary">
              Shop
            </Link>
            <Link href="/dev" className="hover:duo-text-primary">
              Dev Tools
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
