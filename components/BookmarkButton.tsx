'use client';

import { useState, useEffect } from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';

interface BookmarkButtonProps {
  lessonId: string;
  sourceId: string;
  title: string;
  size?: 'small' | 'medium' | 'large';
}

export default function BookmarkButton({
  lessonId,
  sourceId,
  title,
  size = 'medium',
}: BookmarkButtonProps) {
  const { toggle, isBookmarked: check } = useBookmarks();
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(check(lessonId));
  }, [lessonId, check]);

  const handleClick = () => {
    const newState = toggle(lessonId, sourceId, title);
    setBookmarked(newState);
  };

  return (
    <button
      className={`bookmark-button ${bookmarked ? 'bookmarked' : ''} ${size}`}
      onClick={handleClick}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
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
      >
        {bookmarked ? (
          <path
            d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
            fill="currentColor"
            stroke="none"
          />
        ) : (
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="none" />
        )}
      </svg>
    </button>
  );
}
