'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  HouseIcon,
  DumbbellIcon,
  DuolingoShieldIcon,
  DuolingoChestNavIcon,
  DuolingoShopNavIcon,
  DuolingoProfileNavIcon,
  DuolingoMoreNavIcon,
  DuolingoGearIcon,
} from '../icons/NavIcons';
import { ThemeToggle } from '../ui/ThemeToggle';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'LEARN', href: '/learn', icon: <HouseIcon className="w-8 h-8" /> },
    { label: 'PRACTICE', href: '/practice', icon: <DumbbellIcon className="w-8 h-8" /> },
    { label: 'LEADERBOARDS', href: '/leaderboard', icon: <DuolingoShieldIcon className="w-8 h-8" /> },
    { label: 'QUESTS', href: '/quests', icon: <DuolingoChestNavIcon className="w-8 h-8" /> },
    { label: 'SHOP', href: '/shop', icon: <DuolingoShopNavIcon className="w-8 h-8" /> },
    { label: 'PROFILE', href: '/profile', icon: <DuolingoProfileNavIcon className="w-8 h-8" initial="J" /> },
    { label: 'MORE', href: '/dev', icon: <DuolingoMoreNavIcon className="w-8 h-8" /> },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 border-r-2 border-[#37464F] dark:border-[#37464F] bg-[#131F24] dark:bg-[#131F24] flex flex-col justify-between p-4 z-40 hidden md:flex select-none">
      <div>
        {/* Brand Header */}
        <Link href="/learn" className="flex items-center gap-2 px-4 pt-6 pb-8">
          <span className="text-3xl font-black tracking-tight text-[#58CC02] hover:brightness-105 transition-all">
            duolingo
          </span>
        </Link>

        {/* Navigation list matching screenshot */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-sm tracking-wider uppercase transition-all duration-100',
                  isActive
                    ? 'bg-[#202F36] border-2 border-[#84D8FF] text-[#1CB0F6] shadow-sm'
                    : 'text-[#F1F7FB] hover:bg-[#202F36]/60 border-2 border-transparent'
                )}
              >
                <div className="shrink-0 flex items-center justify-center w-8 h-8">{item.icon}</div>
                <span className={cn('text-sm font-black', isActive ? 'text-[#1CB0F6]' : 'text-[#F1F7FB]')}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Theme Toggle & Settings */}
      <div className="pt-4 border-t border-[#37464F] space-y-2">
        <ThemeToggle className="w-full" />

        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-sm tracking-wider uppercase transition-colors',
            pathname === '/settings'
              ? 'bg-[#202F36] border-2 border-[#84D8FF] text-[#1CB0F6]'
              : 'text-[#F1F7FB] hover:bg-[#202F36]/60 border-2 border-transparent'
          )}
        >
          <div className="shrink-0 flex items-center justify-center w-7 h-7">
            <DuolingoGearIcon className="w-7 h-7" />
          </div>
          <span className={cn('text-sm font-black', pathname === '/settings' ? 'text-[#1CB0F6]' : 'text-[#F1F7FB]')}>
            SETTINGS
          </span>
        </Link>
      </div>
    </aside>
  );
}
