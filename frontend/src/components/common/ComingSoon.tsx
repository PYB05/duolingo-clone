'use client';

import React from 'react';
import Link from 'next/link';
import { OwlMascot } from '@/components/mascot/OwlMascot';
import { Button } from '@/components/ui/Button';

interface ComingSoonProps {
  title: string;
  description: string;
  featureBadge?: string;
}

export function ComingSoon({ title, description, featureBadge = 'COMING SOON' }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center select-none">
      <div className="mb-6 relative">
        <OwlMascot expression="sleeping" className="w-32 h-32 animate-bounce-gentle" />
        <span className="absolute -top-2 -right-4 bg-bee text-eel font-black text-xs px-2.5 py-1 rounded-full uppercase tracking-wider border-2 border-white shadow-sm">
          {featureBadge}
        </span>
      </div>

      <h1 className="text-3xl font-black text-[#F1F7FB] mb-3">{title}</h1>
      <p className="text-[#829BA8] font-bold text-base max-w-md mb-8 leading-relaxed">
        {description}
      </p>

      <Link href="/learn">
        <Button variant="primary" size="lg">
          CONTINUE LEARNING
        </Button>
      </Link>
    </div>
  );
}
