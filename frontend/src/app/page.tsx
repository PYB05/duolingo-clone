'use client';

import React from 'react';
import Link from 'next/link';
import { OwlMascot } from '@/components/mascot/OwlMascot';
import { Button } from '@/components/ui/Button';
import { FlameIcon, HeartIcon, BoltIcon, StarIcon } from '@/components/icons';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Flag } from '@/components/ui/Flag';

export default function HomePage() {
  const languages = [
    { name: 'Spanish', code: 'ES', learners: '34M learners' },
    { name: 'French', code: 'FR', learners: '21M learners' },
    { name: 'German', code: 'DE', learners: '14M learners' },
    { name: 'Japanese', code: 'JP', learners: '18M learners' },
    { name: 'Italian', code: 'IT', learners: '9M learners' },
  ];

  const features = [
    {
      title: 'Free. Fun. Effective.',
      description:
        'Learning with Duolingo is fun, and research shows that it works! With quick, bite-sized lessons, you’ll earn points and unlock new levels while gaining real-world communication skills.',
      icon: <StarIcon className="w-8 h-8 text-bee" />,
      bg: 'bg-bee/10',
      border: 'border-bee/30',
    },
    {
      title: 'Backed by Science',
      description:
        'We use a combination of research-backed teaching methods and delightfully delightful content to create courses that effectively teach reading, writing, listening, and speaking skills.',
      icon: <BoltIcon className="w-8 h-8 text-macaw" />,
      bg: 'bg-sky/20',
      border: 'border-sky-border',
    },
    {
      title: 'Stay Motivated',
      description:
        'We make it easy to form a habit of language learning with game-like features, fun challenges, and reminders from our friendly mascot, Duo the Owl.',
      icon: <FlameIcon className="w-8 h-8 text-fox" active />,
      bg: 'bg-fox/15',
      border: 'border-fox/30',
    },
    {
      title: 'Personalized Learning',
      description:
        'Combining the best of AI and language science, lessons are tailored to help you learn at just the right level and pace, re-testing concepts you found difficult.',
      icon: <HeartIcon className="w-8 h-8 text-cardinal" active />,
      bg: 'bg-cardinal/15',
      border: 'border-cardinal/30',
    },
  ];

  return (
    <div className="min-h-screen duo-bg-page duo-text-primary select-none flex flex-col justify-between">
      {/* 1. Header */}
      <header className="border-b-2 duo-border py-4 px-6 sm:px-12 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl font-black tracking-tight text-feather">duolingo</span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
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

        {/* 4. Features Section */}
        <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
          <h2 className="text-2xl sm:text-3xl font-black text-center duo-text-primary mb-12">
            Why you&apos;ll love learning with us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feat) => (
              <div
                key={feat.title}
                className={`p-8 rounded-3xl border-2 ${feat.border} duo-bg-surface shadow-sm flex items-start gap-6`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${feat.bg}`}
                >
                  {feat.icon}
                </div>
                <div>
                  <h3 className="text-xl font-black duo-text-primary mb-2">{feat.title}</h3>
                  <p className="duo-text-secondary font-bold text-sm leading-relaxed">{feat.description}</p>
                </div>
              </div>
            ))}
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
