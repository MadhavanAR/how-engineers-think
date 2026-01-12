/**
 * Progress tracking system using localStorage
 */

export interface LessonProgress {
  lessonId: string;
  sourceId: string;
  completed: boolean;
  completedAt?: number;
  timeSpent: number; // in seconds
  lastAccessed: number;
}

export interface UserProgress {
  lessons: Record<string, LessonProgress>;
  totalLessonsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastVisitDate: string;
  totalTimeSpent: number;
  points: number;
}

const STORAGE_KEY = 'how-engineers-think-progress';

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return getDefaultProgress();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const progress = JSON.parse(stored) as UserProgress;
        // Validate progress structure
        if (typeof progress === 'object' && progress !== null) {
          // Update streak if needed
          updateStreak(progress);
          // Ensure all required fields exist
          return {
            lessons: progress.lessons || {},
            totalLessonsCompleted: progress.totalLessonsCompleted || 0,
            currentStreak: progress.currentStreak || 0,
            longestStreak: progress.longestStreak || 0,
            lastVisitDate: progress.lastVisitDate || '',
            totalTimeSpent: progress.totalTimeSpent || 0,
            points: progress.points || 0,
          };
        }
      } catch (parseError) {
        console.error('Error parsing progress data, resetting:', parseError);
        // Reset corrupted data
        saveProgress(getDefaultProgress());
      }
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }

  return getDefaultProgress();
}

function getDefaultProgress(): UserProgress {
  return {
    lessons: {},
    totalLessonsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastVisitDate: '',
    totalTimeSpent: 0,
    points: 0,
  };
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

export function markLessonCompleted(lessonId: string, sourceId: string): void {
  const progress = getProgress();
  const now = Date.now();
  const today = new Date().toDateString();

  if (!progress.lessons[lessonId]) {
    progress.lessons[lessonId] = {
      lessonId,
      sourceId,
      completed: false,
      timeSpent: 0,
      lastAccessed: now,
    };
  }

  const lesson = progress.lessons[lessonId];

  if (!lesson.completed) {
    lesson.completed = true;
    lesson.completedAt = now;
    progress.totalLessonsCompleted++;
    progress.points += 10; // 10 points per lesson
  }

  lesson.lastAccessed = now;
  updateStreak(progress);
  saveProgress(progress);
}

export function updateLessonTime(lessonId: string, seconds: number): void {
  const progress = getProgress();

  if (!progress.lessons[lessonId]) {
    return;
  }

  progress.lessons[lessonId].timeSpent += seconds;
  progress.totalTimeSpent += seconds;
  progress.lessons[lessonId].lastAccessed = Date.now();
  saveProgress(progress);
}

function updateStreak(progress: UserProgress): void {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

  if (progress.lastVisitDate === today) {
    // Already visited today
    return;
  }

  if (progress.lastVisitDate === yesterday) {
    // Continuing streak
    progress.currentStreak++;
  } else if (progress.lastVisitDate !== '') {
    // Streak broken
    if (progress.currentStreak > progress.longestStreak) {
      progress.longestStreak = progress.currentStreak;
    }
    progress.currentStreak = 1;
  } else {
    // First visit
    progress.currentStreak = 1;
  }

  progress.lastVisitDate = today;

  if (progress.currentStreak > progress.longestStreak) {
    progress.longestStreak = progress.currentStreak;
  }
}

export function isLessonCompleted(lessonId: string): boolean {
  const progress = getProgress();
  return progress.lessons[lessonId]?.completed || false;
}

export function getLessonProgress(lessonId: string): LessonProgress | null {
  const progress = getProgress();
  return progress.lessons[lessonId] || null;
}

export function getSourceProgress(
  sourceId: string,
  totalLessonsInSource?: number
): {
  completed: number;
  total: number;
  percentage: number;
} {
  const progress = getProgress();
  const lessons = Object.values(progress.lessons).filter(l => l.sourceId === sourceId);

  const completed = lessons.filter(l => l.completed).length;
  // Use the actual total from the source if provided, otherwise fall back to accessed lessons
  const total = totalLessonsInSource !== undefined ? totalLessonsInSource : lessons.length;

  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
