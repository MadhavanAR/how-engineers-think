'use client';

import { useState } from 'react';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
}

export default function ShareButton({ url, title, description }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Ensure URL is absolute and works independently
    let fullUrl = url;
    if (typeof window !== 'undefined') {
      // If URL is relative, make it absolute
      if (url.startsWith('/')) {
        fullUrl = `${window.location.origin}${url}`;
      } else if (!url.startsWith('http')) {
        fullUrl = `${window.location.origin}/${url}`;
      }
    }
    const text = description ? `${title}\n\n${description}` : title;

    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: fullUrl,
        });
        return;
      } catch (error) {
        // User cancelled or error occurred
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button
      className="share-button"
      onClick={handleShare}
      aria-label="Share lesson"
      title={copied ? 'Copied!' : 'Share this lesson'}
    >
      {copied ? (
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
        >
          <path d="M20 6L9 17l-5-5" fill="none" />
        </svg>
      ) : (
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
        >
          <circle cx="18" cy="5" r="3" fill="none" />
          <circle cx="6" cy="12" r="3" fill="none" />
          <circle cx="18" cy="19" r="3" fill="none" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" fill="none" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" fill="none" />
        </svg>
      )}
    </button>
  );
}
