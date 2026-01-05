import { useState, useEffect } from 'react';
import { Source } from '@/types';

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
      const response = await fetch('/api/sources');
      
      if (!response.ok) {
        throw new Error('Failed to fetch sources');
      }
      
      const data = await response.json();
      setSources(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Failed to fetch sources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  return { sources, loading, error, refetch: fetchSources };
}
