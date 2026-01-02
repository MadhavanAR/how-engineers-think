'use client';

import { Lesson } from '@/types';

interface LessonCardProps {
  lesson: Lesson;
  index: number;
  onClick: () => void;
}

export default function LessonCard({ lesson, index, onClick }: LessonCardProps) {
  return (
    <div className="lesson-card" onClick={onClick}>
      <span className="lesson-number">{String(index).padStart(2, '0')}</span>
      <div>
        <h3>{lesson.title}</h3>
        <p>{lesson.subtitle}</p>
      </div>
    </div>
  );
}
