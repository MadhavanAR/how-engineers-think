'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getProgress,
  markLessonCompleted,
  updateLessonTime,
  isLessonCompleted,
  getLessonProgress,
  getSourceProgress,
  type UserProgress,
} from '@/lib/storage/progress';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(getProgress());

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const completeLesson = useCallback((lessonId: string, sourceId: string) => {
    markLessonCompleted(lessonId, sourceId);
    setProgress(getProgress());
  }, []);

  const addTime = useCallback((lessonId: string, seconds: number) => {
    updateLessonTime(lessonId, seconds);
    setProgress(getProgress());
  }, []);

  const checkCompleted = useCallback((lessonId: string) => {
    return isLessonCompleted(lessonId);
  }, []);

  const getLesson = useCallback((lessonId: string) => {
    return getLessonProgress(lessonId);
  }, []);

  const getSource = useCallback((sourceId: string, totalLessons?: number) => {
    return getSourceProgress(sourceId, totalLessons);
  }, []);

  return {
    progress,
    completeLesson,
    addTime,
    checkCompleted,
    getLesson,
    getSource,
    refresh: () => setProgress(getProgress()),
  };
}
