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
    // If we have a lesson, go to its source page
    // Otherwise, go to home
    if (lesson) {
      router.push(`/source/${lesson.sourceId}`);
    } else {
      router.push('/');
    }
  };

  // Update page title and metadata for sharing
  useEffect(() => {
    if (lesson) {
      const title = `${lesson.title} - How Engineers Think`;
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
      const lessonUrl = `${baseUrl}/lesson/${lesson.id}`;
      const description =
        lesson.description || lesson.subtitle || 'Engineering lesson with code examples';

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
  }, [lesson]);

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
        <LessonView lesson={lesson} onBack={handleBack} />
      </div>
      <Footer />
    </div>
  );
}
