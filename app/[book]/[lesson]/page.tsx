'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LessonView from '@/components/LessonView';
import Footer from '@/components/Footer';
import { Lesson } from '@/types';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const book = params.book as string;
  const lesson = params.lesson as string;
  const [lessonData, setLessonData] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use frontend data service instead of API
        const { getAllLessons } = await import('@/lib/services/frontend-data');
        const lessons = await getAllLessons();

        // Construct the full lesson ID from book and lesson slug
        const fullLessonId = `${book}-${lesson}`;

        // Try to find lesson by full ID first
        let foundLesson = lessons.find(l => l.id === fullLessonId);

        // If not found, try to find by sourceId and lesson slug
        if (!foundLesson) {
          foundLesson = lessons.find(l => {
            if (l.sourceId !== book) return false;
            // Extract lesson slug from lesson ID (remove sourceId prefix)
            const lessonSlug = l.id.replace(`${l.sourceId}-`, '');
            return lessonSlug === lesson;
          });
        }

        if (!foundLesson) {
          setError('Lesson not found');
          return;
        }
        setLessonData(foundLesson);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    if (book && lesson) {
      fetchLesson();
    }
  }, [book, lesson]);

  const handleBack = () => {
    // If we have a lesson, go to its source page
    // Otherwise, go to home
    if (lessonData) {
      router.push(`/source/${lessonData.sourceId}`);
    } else {
      router.push('/');
    }
  };

  // Update page title and metadata for sharing
  useEffect(() => {
    if (lessonData) {
      const title = `${lessonData.title} - How Engineers Think`;
      document.title = title;

      // Update meta tags for better sharing
      const updateMetaTag = (name: string, content: string, property?: boolean) => {
        const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
        let meta = document.querySelector(selector);
        if (!meta) {
          meta = document.createElement('meta');
          if (property) {
            meta.setAttribute('property', name);
          } else {
            meta.setAttribute('name', name);
          }
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const lessonUrl = `${baseUrl}/${book}/${lesson}`;
      const description =
        lessonData.description || lessonData.subtitle || 'Engineering lesson with code examples';

      // Standard meta tags
      updateMetaTag('description', description);
      updateMetaTag('title', title);

      // Open Graph tags for better sharing
      updateMetaTag('og:title', title, true);
      updateMetaTag('og:description', description, true);
      updateMetaTag('og:url', lessonUrl, true);
      updateMetaTag('og:type', 'article', true);

      // Twitter Card tags
      updateMetaTag('twitter:card', 'summary', true);
      updateMetaTag('twitter:title', title, true);
      updateMetaTag('twitter:description', description, true);

      // Canonical URL
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', lessonUrl);
    }
  }, [lessonData, book, lesson]);

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

  if (error || !lessonData) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="error-state">
            <h2>Lesson Not Found</h2>
            <p>{error || 'The lesson you are looking for does not exist.'}</p>
            <button onClick={() => router.push('/')} className="back-button">
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
        <LessonView lesson={lessonData} onBack={handleBack} />
      </div>
      <Footer />
    </div>
  );
}
