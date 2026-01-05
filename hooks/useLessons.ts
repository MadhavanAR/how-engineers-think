import { useState, useEffect } from 'react';
import { Lesson } from '@/types';

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
      const response = await fetch('/api/lessons');
      
      if (!response.ok) {
        throw new Error('Failed to fetch lessons');
      }
      
      const data = await response.json();
      setLessons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Failed to fetch lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  return { lessons, loading, error, refetch: fetchLessons };
}

