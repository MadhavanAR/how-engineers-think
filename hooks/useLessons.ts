import { useState, useEffect } from 'react';
import { Lesson } from '@/types';
import { getAllLessons, preloadData } from '@/lib/services/frontend-data';

interface UseLessonsReturn {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLessons(): UseLessonsReturn {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use frontend data service instead of API
      const data = await getAllLessons();
      setLessons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Failed to fetch lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Preload data on mount
    preloadData();
    fetchLessons();
  }, []);

  return { lessons, loading, error, refetch: fetchLessons };
}
