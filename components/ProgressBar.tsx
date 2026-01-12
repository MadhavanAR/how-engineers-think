'use client';

import { useProgress } from '@/hooks/useProgress';
import { Source } from '@/types';

interface ProgressBarProps {
  source: Source;
}

export default function ProgressBar({ source }: ProgressBarProps) {
  const { getSource } = useProgress();
  const progress = getSource(source.id, source.lessons.length);

  if (progress.total === 0) {
    return null;
  }

  const isComplete = progress.percentage === 100;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-header">
        <div className="progress-header-left">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="progress-icon"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" fill="none" />
            <polyline points="22 4 12 14.01 9 11.01" fill="none" />
          </svg>
          <div>
            <h3 className="progress-title">Learning Progress</h3>
            <p className="progress-subtitle">
              {isComplete ? (
                <span className="progress-complete">All lessons completed! 🎉</span>
              ) : (
                <span>
                  {progress.completed} of {progress.total} lessons completed
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="progress-percentage-badge">
          <span className="progress-percentage-value">{progress.percentage}</span>
          <span className="progress-percentage-symbol">%</span>
        </div>
      </div>
      <div className="progress-bar">
        <div
          className={`progress-bar-fill ${isComplete ? 'complete' : ''}`}
          style={{ width: `${progress.percentage}%` }}
        >
          {isComplete && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="progress-checkmark"
            >
              <polyline points="20 6 9 17 4 12" fill="none" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
