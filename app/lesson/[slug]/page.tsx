'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LessonView from '@/components/LessonView';
import Footer from '@/components/Footer';
import { Lesson } from '@/types';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use frontend data service instead of API
        const { getLessonById } = await import('@/lib/services/frontend-data');
        const foundLesson = await getLessonById(slug);

        if (!foundLesson) {
          setError('Lesson not found');
          return;
        }
        setLesson(foundLesson);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchLesson();
    }
  }, [slug]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="loading-state">Loading lesson...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="error-state">
            <h2>Lesson Not Found</h2>
            <p>{error || 'The lesson you are looking for does not exist.'}</p>
            <button onClick={handleBack} className="back-button">
              Back to Lessons
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
        <LessonView lesson={lesson} onBack={handleBack} />
      </div>
      <Footer />
    </div>
  );
}
