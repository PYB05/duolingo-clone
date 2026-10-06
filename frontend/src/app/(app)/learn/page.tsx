'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { UnitBanner } from '@/components/path/UnitBanner';
import { PathNode } from '@/components/path/PathNode';
import { PathPopover } from '@/components/path/PathPopover';
import { OwlMascot } from '@/components/mascot/OwlMascot';
import { CharacterAvatar } from '@/components/mascot/CharacterAvatar';

// Authentic Duolingo Path Zig-Zag Offsets matching screenshot 1
const ZIG_ZAG_OFFSETS = [0, 45, 75, 45, 0, -45, -75, -45];

export default function LearnPage() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({ queryKey: ['me'], queryFn: () => api.getMe() });
  const { data: course, isLoading } = useQuery({
    queryKey: ['course'],
    queryFn: () => api.getCourse(),
  });

  const [selectedSkill, setSelectedSkill] = useState<any | null>(null);

  const openChestMutation = useMutation({
    mutationFn: (skillId: number) => api.openChest(skillId),
    onSuccess: (data) => {
      alert(`🎉 Chest opened! You earned ${data.gems_awarded} gems!`);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['course'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Could not open chest.');
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <OwlMascot expression="thinking" className="w-24 h-24 animate-pulse" />
        <span className="font-extrabold duo-text-secondary text-sm tracking-wider">
          LOADING YOUR PATH...
        </span>
      </div>
    );
  }

  if (!course || !course.sections.length) {
    return (
      <div className="text-center py-20 duo-text-secondary font-bold">
        No course curriculum found.
      </div>
    );
  }

  let globalSkillIndex = 0;

  return (
    <div className="pb-24 flex flex-col items-center max-w-[560px] mx-auto relative">
      {course.sections.map((section) => (
        <div key={section.id} className="w-full">
          {section.units.map((unit, unitIdx) => (
            <div key={unit.id} className="mb-14 w-full flex flex-col items-center relative">
              {/* Unit Banner */}
              <UnitBanner
                unitId={unit.id}
                unitNumber={unit.order_index}
                sectionNumber={section.order_index}
                title={unit.title}
                description={unit.description}
                themeColor={unit.theme_color || '#CE82FF'}
                themeShadowColor={unit.theme_shadow_color || '#A568CC'}
                guidebookMd={unit.has_guidebook ? '# Welcome to ' + unit.title : null}
              />

              {/* Zig-Zag Path Nodes with Character Mascots on side */}
              <div className="relative flex flex-col items-center w-full py-4">
                {/* Lily Mascot beside the path (matching screenshot 1) */}
                {unitIdx === 0 && (
                  <div className="absolute left-2 sm:left-4 top-28 z-20 pointer-events-none hidden sm:block">
                    <CharacterAvatar character="lily" className="w-36 h-40 drop-shadow-xl" />
                  </div>
                )}

                {/* Junior Mascot on second unit */}
                {unitIdx === 1 && (
                  <div className="absolute right-4 top-36 z-20 pointer-events-none hidden sm:block">
                    <CharacterAvatar character="junior" className="w-32 h-36 drop-shadow-xl" />
                  </div>
                )}

                {/* Bea Mascot on third unit */}
                {unitIdx === 2 && (
                  <div className="absolute left-4 top-32 z-20 pointer-events-none hidden sm:block">
                    <CharacterAvatar character="bea" className="w-32 h-36 drop-shadow-xl" />
                  </div>
                )}

                {unit.skills.map((skill, sIdx) => {
                  const offset = ZIG_ZAG_OFFSETS[globalSkillIndex % ZIG_ZAG_OFFSETS.length];
                  globalSkillIndex++;

                  // Determine iconType: audio drills get headphones, others get star
                  const isAudioOrListening = skill.title.toLowerCase().includes('listen') || skill.title.toLowerCase().includes('audio') || sIdx === 1;
                  const iconType = isAudioOrListening ? 'headphones' : 'star';

                  return (
                    <PathNode
                      key={skill.id}
                      id={skill.id}
                      kind={skill.kind}
                      title={skill.title}
                      state={skill.state}
                      isCurrent={skill.is_current}
                      lessonsCompleted={skill.lessons_completed}
                      totalLevels={skill.total_levels}
                      themeColor={unit.theme_color || '#CE82FF'}
                      themeShadowColor={unit.theme_shadow_color || '#A568CC'}
                      chestOpened={skill.chest_opened}
                      offsetX={offset}
                      iconType={iconType}
                      onClick={() =>
                        setSelectedSkill({
                          id: skill.id,
                          title: skill.title,
                          kind: skill.kind,
                          state: skill.state,
                          lessons_completed: skill.lessons_completed,
                          total_levels: skill.total_levels,
                          is_legendary: skill.is_legendary,
                        })
                      }
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Path Node Click Modal Popover */}
      <PathPopover
        isOpen={Boolean(selectedSkill)}
        onClose={() => setSelectedSkill(null)}
        skill={selectedSkill}
        hearts={user?.hearts ?? 5}
        onOpenChest={(skillId) => openChestMutation.mutate(skillId)}
      />
    </div>
  );
}
