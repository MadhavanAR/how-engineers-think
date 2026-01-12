'use client';

import { useEffect } from 'react';
import { preloadData } from '@/lib/services/frontend-data';

/**
 * Component to initialize all frontend services on app load
 * This ensures data and storage are ready before user interactions
 */
export default function DataInitializer() {
  useEffect(() => {
    // Initialize all services in parallel
    const initializeServices = async () => {
      try {
        // Preload lesson data (this is critical for the app to work)
        await preloadData();

        // Initialize IndexedDB and migrate from localStorage (optional enhancement)
        if (typeof window !== 'undefined' && 'indexedDB' in window) {
          try {
            const { initDB, migrateFromLocalStorage } = await import('@/lib/storage/indexed-db');
            await initDB();
            await migrateFromLocalStorage();
          } catch (storageError) {
            // IndexedDB is optional - localStorage works fine as fallback
            // Silently continue with localStorage
          }
        }
      } catch (error) {
        // Log error but don't block the app
        console.error('Service initialization error:', error);
        // The app will continue with fallback data
      }
    };

    // Initialize immediately
    initializeServices();
  }, []);

  // This component doesn't render anything
  return null;
}
