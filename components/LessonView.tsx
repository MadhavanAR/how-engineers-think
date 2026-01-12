'use client';

import { useState, useEffect } from 'react';
import { Lesson, Source } from '@/types';
import SingleIDE from './SingleIDE';
import BookmarkButton from './BookmarkButton';
import ShareButton from './ShareButton';
import NextLessonButton from './NextLessonButton';
import LessonCompletionAnimation from './LessonCompletionAnimation';
import { useProgress } from '@/hooks/useProgress';
import { useSources } from '@/hooks/useSources';
import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ToastContainer';

interface LessonViewProps {
  lesson: Lesson;
  onBack: () => void;
}

export default function LessonView({ lesson, onBack }: LessonViewProps) {
  const { completeLesson, addTime, checkCompleted } = useProgress();
  const { sources } = useSources();
  const { showToast, toasts, removeToast } = useToast();
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [showCompletion, setShowCompletion] = useState(false);
  const [wasCompleted, setWasCompleted] = useState(checkCompleted(lesson.id));

  // Track time spent on lesson
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setTimeSpent(elapsed);
      if (elapsed > 0 && elapsed % 30 === 0) {
        // Update every 30 seconds
        addTime(lesson.id, 30);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lesson.id, startTime, addTime]);

  // Mark as completed when user spends enough time
  useEffect(() => {
    if (timeSpent >= 60 && !wasCompleted) {
      // Mark complete after 1 minute of reading
      completeLesson(lesson.id, lesson.sourceId);
      setWasCompleted(true);
      setShowCompletion(true);
      showToast('Lesson completed! +10 points', 'success');
    }
  }, [timeSpent, lesson.id, lesson.sourceId, completeLesson, wasCompleted, showToast]);

  const lessonUrl = `/lesson/${lesson.id}`;

  return (
    <>
      <button className="fixed-back-button" onClick={onBack} title="Back to Lessons">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="lesson-view">
        <div className="lesson-header">
          <div className="lesson-header-top">
            <div>
              <h2>{lesson.title}</h2>
              <p className="subtitle">{lesson.subtitle}</p>
            </div>
            <div className="lesson-actions">
              <BookmarkButton
                lessonId={lesson.id}
                sourceId={lesson.sourceId}
                title={lesson.title}
              />
              <ShareButton url={lessonUrl} title={lesson.title} description={lesson.subtitle} />
            </div>
          </div>
        </div>

        <div className="concept-section">
          <h3>{lesson.concept.title}</h3>
          <p>{lesson.concept.content}</p>
        </div>

        <div className="concept-section">
          <h3>{lesson.scenario.title}</h3>
          <p>{lesson.scenario.content}</p>
        </div>

        <div className="concept-section">
          <h3>Where you&apos;ll see this in real projects</h3>
          <ul>
            {lesson.applications.map((app, index) => (
              <li key={index}>{app}</li>
            ))}
          </ul>
        </div>

        <div className="code-examples">
          <SingleIDE lesson={lesson} />
        </div>

        <NextLessonButton currentLesson={lesson} sources={sources} />
      </div>

      {showCompletion && <LessonCompletionAnimation onComplete={() => setShowCompletion(false)} />}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
