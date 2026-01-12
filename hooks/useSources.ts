import { useState, useEffect } from 'react';
import { Source } from '@/types';
import { getAllSources, preloadData } from '@/lib/services/frontend-data';

interface UseSourcesReturn {
  sources: Source[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSources(): UseSourcesReturn {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSources = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use frontend data service instead of API
      const data = await getAllSources();
      setSources(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Failed to fetch sources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Preload data on mount
    preloadData();
    fetchSources();
  }, []);

  return { sources, loading, error, refetch: fetchSources };
}
