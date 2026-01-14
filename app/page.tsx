'use client';

import SourceCard from '@/components/SourceCard';
import Footer from '@/components/Footer';
import { useSources } from '@/hooks/useSources';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ToastContainer';
import Link from 'next/link';

export default function Home() {
  const { sources, loading } = useSources();
  const { bookmarks } = useBookmarks();
  const { toasts, removeToast } = useToast();

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="loading-state">Loading sources...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <header>
          <div className="header-top">
            <div>
              <h1>How Engineers Think</h1>
              <p className="subtitle">Where &apos;it works on my machine&apos; meets reality</p>
            </div>
            <div className="header-actions">
              <a
                href="https://github.com/MadhavanAR/how-engineers-think"
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
                title="Contribute on GitHub"
                aria-label="Contribute on GitHub"
              >
                <span className="github-link-text">Contribute</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="/feed.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="rss-link"
                title="RSS Feed"
                aria-label="RSS Feed"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M4 11a9 9 0 0 1 9 9" fill="none" />
                  <path d="M4 4a16 16 0 0 1 16 16" fill="none" />
                  <circle cx="5" cy="19" r="1" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>
        </header>

        {bookmarks.length > 0 && (
          <section className="bookmarks-section">
            <h2>⭐ Your Bookmarks</h2>
            <div className="bookmarks-list">
              {bookmarks.map(bookmark => {
                // Convert lessonId to new URL format: /{sourceId}/{lessonSlug}
                // Lesson ID format: Pragmatic-programmer-01-taking-responsibility
                // Extract sourceId (first two parts) and lessonSlug (rest)
                const parts = bookmark.lessonId.split('-');
                const sourceId = parts.slice(0, 2).join('-'); // Pragmatic-programmer
                const lessonSlug = parts.slice(2).join('-'); // 01-taking-responsibility
                const lessonUrl = `/${sourceId}/${lessonSlug}`;
                return (
                  <Link key={bookmark.lessonId} href={lessonUrl} className="bookmark-item">
                    <span className="bookmark-icon">⭐</span>
                    <div className="bookmark-content">
                      <div className="bookmark-title">{bookmark.title}</div>
                      <div className="bookmark-meta">
                        {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <main id="main-content">
          <nav className="sources-nav" aria-label="Sources">
            {sources.map(source => (
              <SourceCard key={source.id} source={source} />
            ))}
          </nav>
        </main>
      </div>
      <Footer />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
