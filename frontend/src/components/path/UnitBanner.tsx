'use client';

import React, { useState } from 'react';
import { BookIcon } from '../icons';
import { GuidebookModal } from './GuidebookModal';

export interface UnitBannerProps {
  unitId?: number;
  unitNumber: number;
  sectionNumber?: number;
  title: string;
  description?: string | null;
  themeColor: string;
  themeShadowColor: string;
  guidebookMd?: string | null;
}

export function UnitBanner({
  unitId,
  unitNumber,
  sectionNumber = 1,
  title,
  description,
  themeColor,
  themeShadowColor,
  guidebookMd,
}: UnitBannerProps) {
  const [guidebookOpen, setGuidebookOpen] = useState(false);

  return (
    <>
      <div
        className="w-full rounded-2xl p-5 mb-6 text-white flex items-center justify-between select-none shadow-sm"
        style={{
          backgroundColor: themeColor,
          borderBottom: `4px solid ${themeShadowColor}`,
        }}
      >
        <div className="flex flex-col gap-1">
          {/* Header Row with back arrow & section label */}
          <div className="flex items-center gap-2 text-white/90">
            <span className="text-sm font-black">←</span>
            <span className="text-xs font-black uppercase tracking-wider">
              SECTION {sectionNumber}, UNIT {unitNumber}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black leading-tight tracking-tight">
            {title}
          </h2>
        </div>

        {/* Guidebook Button with 3D inset styling */}
        <button
          onClick={() => setGuidebookOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border-2 border-white/25 backdrop-blur-sm font-black text-xs uppercase tracking-wider transition-all duration-75 active:scale-95 shrink-0 ml-3"
        >
          <BookIcon className="w-5 h-5" />
          <span className="hidden sm:inline tracking-widest font-black">GUIDEBOOK</span>
        </button>
      </div>

      {/* Subtitle Divider */}
      <div className="w-full flex items-center gap-4 mb-8">
        <div className="flex-1 h-[2px] bg-[#37464F]/50 dark:bg-[#37464F] light:bg-[#E5E5E5]" />
        <span className="text-sm font-extrabold text-[#829BA8] dark:text-[#829BA8] light:text-[#777777] uppercase tracking-wider">
          {title}
        </span>
        <div className="flex-1 h-[2px] bg-[#37464F]/50 dark:bg-[#37464F] light:bg-[#E5E5E5]" />
      </div>

      <GuidebookModal
        isOpen={guidebookOpen}
        onClose={() => setGuidebookOpen(false)}
        unitId={unitId}
        unitNumber={unitNumber}
        sectionNumber={sectionNumber}
        title={title}
        description={description}
        themeColor={themeColor}
        themeShadowColor={themeShadowColor}
        markdown={guidebookMd}
      />
    </>
  );
}
