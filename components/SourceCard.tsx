'use client';

import Link from 'next/link';
import { Source } from '@/types';

interface SourceCardProps {
  source: Source;
}

export default function SourceCard({ source }: SourceCardProps) {
  return (
    <Link href={`/source/${source.id}`} className="source-card-link">
      <div className="source-card">
        <div className="source-card-content">
          <div className="source-card-header">
            <h3>{source.name}</h3>
          </div>
          <div className="source-card-footer">
            <p className="source-lesson-count">
              {source.lessons.length} {source.lessons.length === 1 ? 'lesson' : 'lessons'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
