'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
  isBookmarked,
  toggleBookmark,
  type Bookmark,
} from '@/lib/storage/bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(getBookmarks());

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const add = useCallback((lessonId: string, sourceId: string, title: string) => {
    addBookmark(lessonId, sourceId, title);
    setBookmarks(getBookmarks());
  }, []);

  const remove = useCallback((lessonId: string) => {
    removeBookmark(lessonId);
    setBookmarks(getBookmarks());
  }, []);

  const toggle = useCallback((lessonId: string, sourceId: string, title: string) => {
    const result = toggleBookmark(lessonId, sourceId, title);
    setBookmarks(getBookmarks());
    return result;
  }, []);

  const check = useCallback((lessonId: string) => {
    return isBookmarked(lessonId);
  }, []);

  return {
    bookmarks,
    add,
    remove,
    toggle,
    isBookmarked: check,
    refresh: () => setBookmarks(getBookmarks()),
  };
}
