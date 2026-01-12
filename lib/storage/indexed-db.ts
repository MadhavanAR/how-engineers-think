/**
 * IndexedDB Storage Layer
 *
 * Provides a more robust storage solution than localStorage for:
 * - Better performance with large datasets
 * - Structured data storage
 * - Better quota management
 * - Transaction support
 */

const DB_NAME = 'how-engineers-think-db';
const DB_VERSION = 1;

interface Database {
  progress: IDBObjectStore;
  bookmarks: IDBObjectStore;
  preferences: IDBObjectStore;
  lessons: IDBObjectStore;
}

let dbInstance: IDBDatabase | null = null;

/**
 * Initialize IndexedDB
 */
export async function initDB(): Promise<IDBDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('progress')) {
        const progressStore = db.createObjectStore('progress', { keyPath: 'id' });
        progressStore.createIndex('lessonId', 'lessonId', { unique: false });
        progressStore.createIndex('sourceId', 'sourceId', { unique: false });
      }

      if (!db.objectStoreNames.contains('bookmarks')) {
        const bookmarksStore = db.createObjectStore('bookmarks', { keyPath: 'lessonId' });
        bookmarksStore.createIndex('sourceId', 'sourceId', { unique: false });
        bookmarksStore.createIndex('bookmarkedAt', 'bookmarkedAt', { unique: false });
      }

      if (!db.objectStoreNames.contains('preferences')) {
        db.createObjectStore('preferences', { keyPath: 'key' });
      }

      if (!db.objectStoreNames.contains('lessons')) {
        const lessonsStore = db.createObjectStore('lessons', { keyPath: 'id' });
        lessonsStore.createIndex('sourceId', 'sourceId', { unique: false });
      }
    };
  });
}

/**
 * Generic get operation
 */
export async function get<T>(storeName: string, key: string): Promise<T | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => {
      reject(new Error(`Failed to get ${key} from ${storeName}`));
    };
  });
}

/**
 * Generic put operation
 */
export async function put<T>(storeName: string, value: T): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(value);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error(`Failed to put value in ${storeName}`));
    };
  });
}

/**
 * Generic delete operation
 */
export async function remove(storeName: string, key: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error(`Failed to delete ${key} from ${storeName}`));
    };
  });
}

/**
 * Get all records from a store
 */
export async function getAll<T>(storeName: string): Promise<T[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = () => {
      reject(new Error(`Failed to get all from ${storeName}`));
    };
  });
}

/**
 * Query by index
 */
export async function queryByIndex<T>(
  storeName: string,
  indexName: string,
  value: any
): Promise<T[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = () => {
      reject(new Error(`Failed to query ${indexName} in ${storeName}`));
    };
  });
}

/**
 * Clear all data from a store
 */
export async function clearStore(storeName: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error(`Failed to clear ${storeName}`));
    };
  });
}

/**
 * Migrate data from localStorage to IndexedDB
 */
export async function migrateFromLocalStorage(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // Check if migration has already been done
    const migrated = localStorage.getItem('indexeddb-migrated');
    if (migrated === 'true') {
      return;
    }

    // Migrate progress
    const progressData = localStorage.getItem('how-engineers-think-progress');
    if (progressData) {
      try {
        const progress = JSON.parse(progressData);
        // Store in IndexedDB (you'll need to adapt this to your schema)
        await put('progress', { id: 'user-progress', ...progress });
      } catch (error) {
        console.error('Failed to migrate progress:', error);
      }
    }

    // Migrate bookmarks
    const bookmarksData = localStorage.getItem('how-engineers-think-bookmarks');
    if (bookmarksData) {
      try {
        const bookmarks = JSON.parse(bookmarksData);
        for (const bookmark of bookmarks) {
          await put('bookmarks', bookmark);
        }
      } catch (error) {
        console.error('Failed to migrate bookmarks:', error);
      }
    }

    // Migrate preferences
    const prefsData = localStorage.getItem('how-engineers-think-preferences');
    if (prefsData) {
      try {
        const prefs = JSON.parse(prefsData);
        for (const [key, value] of Object.entries(prefs)) {
          await put('preferences', { key, value });
        }
      } catch (error) {
        console.error('Failed to migrate preferences:', error);
      }
    }

    // Mark migration as complete
    localStorage.setItem('indexeddb-migrated', 'true');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}
