'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { RightRail } from '@/components/layout/RightRail';
import { TopStatsBar } from '@/components/layout/TopStatsBar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen duo-bg-page flex justify-center">
      {/* Desktop Sidebar (fixed left) */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 max-w-6xl md:ml-64 flex justify-center lg:justify-between px-4 sm:px-8 pt-2 pb-20 md:pb-6">
        {/* Centre content column (max 620px) */}
        <main className="w-full max-w-[620px]">
          {/* Mobile Top Stats Bar */}
          <div className="lg:hidden sticky top-0 duo-bg-page/95 backdrop-blur z-30 mb-2 border-b duo-border">
            <TopStatsBar />
          </div>
          {children}
        </main>

        {/* Desktop Right Rail (Sticks smoothly on single page scroll when finished) */}
        <div className="hidden lg:block ml-10">
          <RightRail />
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
}
