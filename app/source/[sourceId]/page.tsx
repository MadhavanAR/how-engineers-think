'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LessonCard from '@/components/LessonCard';
import Footer from '@/components/Footer';
import { Source } from '@/types';

export default function SourcePage() {
  const params = useParams();
  const router = useRouter();
  const sourceId = params.sourceId as string;
  const [source, setSource] = useState<Source | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSource = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use frontend data service instead of API
        const { getSourceById } = await import('@/lib/services/frontend-data');
        const data = await getSourceById(sourceId);

        if (!data) {
          setError('Source not found');
          return;
        }
        console.log('Source data received:', data);
        console.log('Lessons count:', data.lessons?.length || 0);
        if (data.lessons) {
          data.lessons.forEach((lesson: any, index: number) => {
            console.log(`  Lesson ${index + 1}: ${lesson.title} (ID: ${lesson.id})`);
          });
        }
        setSource(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load source');
      } finally {
        setLoading(false);
      }
    };

    if (sourceId) {
      fetchSource();
    }
  }, [sourceId]);

  const handleBack = () => {
    // Always go to home page to avoid navigation loops
    router.push('/');
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="loading-state">Loading source...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !source) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="error-state">
            <h2>Source Not Found</h2>
            <p>{error || 'The source you are looking for does not exist.'}</p>
            <button onClick={handleBack} className="back-button">
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <button className="fixed-back-button" onClick={handleBack} title="Back to Home">
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

        <div className="source-view">
          <div className="source-header">
            <div className="source-header-left">
              <h2>{source.name}</h2>
              <p className="source-lesson-count">
                {source.lessons.length} {source.lessons.length === 1 ? 'lesson' : 'lessons'}
              </p>
            </div>
          </div>

          <nav className="lessons-nav">
            {source.lessons.map((lesson, index) => (
              <LessonCard key={lesson.id} lesson={lesson} index={index + 1} />
            ))}
          </nav>
        </div>
      </div>
      <Footer />
    </div>
  );
}
