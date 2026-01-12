'use client';

import { useProgress } from '@/hooks/useProgress';

export default function ProgressStats() {
  const { progress } = useProgress();

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="progress-stats-panel">
      <div className="stat-item">
        <div className="stat-value">{progress.totalLessonsCompleted}</div>
        <div className="stat-label">Lessons Completed</div>
      </div>
      <div className="stat-item">
        <div className="stat-value">{progress.currentStreak}</div>
        <div className="stat-label">Day Streak</div>
      </div>
      <div className="stat-item">
        <div className="stat-value">{progress.points}</div>
        <div className="stat-label">Points</div>
      </div>
      <div className="stat-item">
        <div className="stat-value">{formatTime(progress.totalTimeSpent)}</div>
        <div className="stat-label">Time Spent</div>
      </div>
    </div>
  );
}
