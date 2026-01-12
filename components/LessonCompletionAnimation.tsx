'use client';

import { useEffect, useState } from 'react';

interface LessonCompletionAnimationProps {
  onComplete: () => void;
}

export default function LessonCompletionAnimation({ onComplete }: LessonCompletionAnimationProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <div className="completion-animation-overlay">
      <div className="completion-animation">
        <div className="completion-icon">🎉</div>
        <div className="completion-text">Lesson Completed!</div>
        <div className="completion-subtext">+10 Points</div>
      </div>
    </div>
  );
}
