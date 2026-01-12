/**
 * Bookmark system using localStorage
 */

export interface Bookmark {
  lessonId: string;
  sourceId: string;
  title: string;
  bookmarkedAt: number;
}

const STORAGE_KEY = 'how-engineers-think-bookmarks';

export function getBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const bookmarks = JSON.parse(stored) as Bookmark[];
        // Validate bookmarks structure
        if (Array.isArray(bookmarks)) {
          return bookmarks.filter(
            b =>
              b &&
              typeof b.lessonId === 'string' &&
              typeof b.sourceId === 'string' &&
              typeof b.title === 'string'
          );
        }
      } catch (parseError) {
        console.error('Error parsing bookmarks, resetting:', parseError);
        // Reset corrupted data
        saveBookmarks([]);
      }
    }
  } catch (error) {
    console.error('Error loading bookmarks:', error);
  }

  return [];
}

export function saveBookmarks(bookmarks: Bookmark[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Error saving bookmarks:', error);
  }
}

export function addBookmark(lessonId: string, sourceId: string, title: string): void {
  const bookmarks = getBookmarks();

  // Check if already bookmarked
  if (bookmarks.some(b => b.lessonId === lessonId)) {
    return;
  }

  bookmarks.push({
    lessonId,
    sourceId,
    title,
    bookmarkedAt: Date.now(),
  });

  saveBookmarks(bookmarks);
}

export function removeBookmark(lessonId: string): void {
  const bookmarks = getBookmarks();
  const filtered = bookmarks.filter(b => b.lessonId !== lessonId);
  saveBookmarks(filtered);
}

export function isBookmarked(lessonId: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some(b => b.lessonId === lessonId);
}

export function toggleBookmark(lessonId: string, sourceId: string, title: string): boolean {
  if (isBookmarked(lessonId)) {
    removeBookmark(lessonId);
    return false;
  } else {
    addBookmark(lessonId, sourceId, title);
    return true;
  }
}
