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
} from '../icons/NavIcons';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Learn', href: '/learn', icon: <HouseIcon className="w-6 h-6" /> },
    { label: 'Practice', href: '/practice', icon: <DumbbellIcon className="w-6 h-6" /> },
    { label: 'Leagues', href: '/leaderboard', icon: <DuolingoShieldIcon className="w-6 h-6" /> },
    { label: 'Quests', href: '/quests', icon: <DuolingoChestNavIcon className="w-6 h-6" /> },
    { label: 'Shop', href: '/shop', icon: <DuolingoShopNavIcon className="w-6 h-6" /> },
    { label: 'Profile', href: '/profile', icon: <DuolingoProfileNavIcon className="w-6 h-6" initial="J" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#131F24] border-t-2 border-[#37464F] py-2 px-3 flex items-center justify-around z-40 md:hidden select-none">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center p-2 rounded-xl transition-all',
              isActive ? 'bg-[#202F36] border-2 border-[#84D8FF]' : 'opacity-85 hover:opacity-100'
            )}
          >
            {item.icon}
          </Link>
        );
      })}
    </nav>
  );
}
