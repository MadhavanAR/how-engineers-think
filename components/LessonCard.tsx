'use client';

import Link from 'next/link';
import { Lesson } from '@/types';
import { useProgress } from '@/hooks/useProgress';

interface LessonCardProps {
  lesson: Lesson;
  index: number;
}

export default function LessonCard({ lesson, index }: LessonCardProps) {
  const { checkCompleted } = useProgress();
  const isCompleted = checkCompleted(lesson.id);

  return (
    <Link href={`/lesson/${lesson.id}`} className="lesson-card-link">
      <div className={`lesson-card ${isCompleted ? 'completed' : ''}`}>
        <span className="lesson-number">{String(index).padStart(2, '0')}</span>
        <div className="lesson-card-content">
          <h3>{lesson.title}</h3>
          <p>{lesson.subtitle}</p>
        </div>
        {isCompleted && <span className="lesson-completed-badge">✓</span>}
      </div>
    </Link>
  );
}
