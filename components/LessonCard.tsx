'use client';

import Link from 'next/link';
import { Lesson } from '@/types';

interface LessonCardProps {
  lesson: Lesson;
  index: number;
}

export default function LessonCard({ lesson, index }: LessonCardProps) {
  return (
    <Link href={`/lesson/${lesson.id}`} className="lesson-card-link">
      <div className="lesson-card">
        <span className="lesson-number">{String(index).padStart(2, '0')}</span>
        <div className="lesson-card-content">
          <h3>{lesson.title}</h3>
          <p>{lesson.subtitle}</p>
        </div>
      </div>
    </Link>
  );
}
