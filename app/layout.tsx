import type { Metadata } from 'next';
import './globals.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { keyboardShortcuts } from '@/lib/utils/keyboard-shortcuts';
import DataInitializer from '@/components/DataInitializer';

export const metadata: Metadata = {
  title: 'How Engineers Think',
  description: 'Real-world engineering lessons, explained with code',
  keywords: ['engineering', 'programming', 'software development', 'lessons', 'code examples'],
  authors: [{ name: 'How Engineers Think' }],
  openGraph: {
    title: 'How Engineers Think',
    description: 'Real-world engineering lessons, explained with code',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="How Engineers Think RSS Feed"
          href="/feed.xml"
        />
        {/* Preload Pyodide for faster Python execution */}
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"
          as="script"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <ErrorBoundary>
          <DataInitializer />
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
