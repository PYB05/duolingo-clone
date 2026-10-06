'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useLessonStore } from '@/store/lessonStore';
import { OwlMascot } from '@/components/mascot/OwlMascot';

function LessonStartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initLesson = useLessonStore((s) => s.initLesson);

  const skillId = searchParams.get('skillId');
  const level = searchParams.get('level');
  const practiceKind = searchParams.get('practice');

  useEffect(() => {
    async function start() {
      try {
        let res;
        if (practiceKind) {
          res = await api.startPractice(practiceKind, skillId ? parseInt(skillId, 10) : undefined);
        } else {
          const lessonId = skillId ? (parseInt(skillId, 10) - 1) * 3 + (parseInt(level || '1', 10)) : 1;
          res = await api.startLesson(lessonId);
        }

        initLesson(res.attempt_id, res.kind, res.hearts, res.exercises);
        router.replace(`/lesson/${res.attempt_id}`);
      } catch (err: any) {
        alert(err.message || 'Could not start lesson.');
        router.replace('/learn');
      }
    }

    start();
  }, [skillId, level, practiceKind, router, initLesson]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <OwlMascot expression="thinking" className="w-28 h-28 animate-pulse mb-4" />
      <h2 className="text-xl font-black text-eel uppercase tracking-wider">
        PREPARING LESSON...
      </h2>
    </div>
  );
}

export default function LessonStartPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
          <OwlMascot expression="thinking" className="w-28 h-28 animate-pulse mb-4" />
          <h2 className="text-xl font-black text-eel uppercase tracking-wider">
            LOADING...
          </h2>
        </div>
      }
    >
      <LessonStartContent />
    </Suspense>
  );
}
