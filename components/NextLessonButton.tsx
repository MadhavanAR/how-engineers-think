'use client';

import { useMemo } from 'react';
import { Source, Lesson } from '@/types';
import Link from 'next/link';
import { getLessonUrl } from '@/lib/services/frontend-data';

interface NextLessonButtonProps {
  currentLesson: Lesson;
  sources: Source[];
}

export default function NextLessonButton({ currentLesson, sources }: NextLessonButtonProps) {
  const nextLesson = useMemo(() => {
    const source = sources.find(s => s.id === currentLesson.sourceId);
    if (!source) return null;

    const currentIndex = source.lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex === -1 || currentIndex === source.lessons.length - 1) {
      return null;
    }

    return source.lessons[currentIndex + 1];
  }, [currentLesson, sources]);

  if (!nextLesson) return null;

  const nextLessonUrl = getLessonUrl(nextLesson);

  return (
    <Link href={nextLessonUrl} className="next-lesson-button">
      <span className="next-lesson-title">{nextLesson.title}</span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 12h14M12 5l7 7-7 7" fill="none" />
      </svg>
    </Link>
  );
}
