/**
 * Frontend Data Service
 *
 * This service provides all lesson and source data directly to the frontend
 * without requiring backend API calls. Data is loaded from static files
 * or embedded in the bundle.
 */

import { Source, Lesson } from '@/types';

// This will be populated at build time or loaded from a static JSON file
let sourcesCache: Source[] | null = null;
let lessonsCache: Lesson[] | null = null;

/**
 * Initialize data from static sources
 * This can load from a JSON file, import from a module, or use build-time data
 */
export async function initializeData(): Promise<void> {
  if (sourcesCache && lessonsCache) {
    return; // Already initialized
  }

  try {
    // Try to load from static JSON file first (generated at build time)
    // Use absolute URL to ensure it works in all environments
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const dataUrl = `${baseUrl}/data/lessons.json`;

    const response = await fetch(dataUrl, {
      cache: 'default', // Allow browser caching
    });

    if (response.ok) {
      const data = await response.json();
      const sources = data.sources || [];
      const lessons = data.lessons || [];
      sourcesCache = sources;
      lessonsCache = lessons;
      console.log(
        `✓ Loaded ${sources.length} source(s) and ${lessons.length} lesson(s) from lessons.json`
      );
      return;
    } else {
      console.warn(`Failed to load lessons.json: HTTP ${response.status}`);
    }
  } catch (error) {
    console.warn('Could not load lessons.json, using fallback data:', error);
  }

  // Fallback: Use hardcoded data
  // In production, this should only happen if the data file is missing
  console.warn('Using fallback data - lessons.json may not be available');
  sourcesCache = getFallbackSources();
  lessonsCache = getFallbackLessons();
}

/**
 * Get all sources
 */
export async function getAllSources(): Promise<Source[]> {
  if (!sourcesCache) {
    await initializeData();
  }
  return sourcesCache || [];
}

/**
 * Get all lessons
 */
export async function getAllLessons(): Promise<Lesson[]> {
  if (!lessonsCache) {
    await initializeData();
  }
  return lessonsCache || [];
}

/**
 * Get lesson by ID
 * Handles URL-encoded IDs and legacy IDs with special characters
 */
export async function getLessonById(id: string): Promise<Lesson | undefined> {
  const lessons = await getAllLessons();

  // First try exact match
  let lesson = lessons.find(lesson => lesson.id === id);
  if (lesson) return lesson;

  // Try URL-decoded version
  const decodedId = decodeURIComponent(id);
  lesson = lessons.find(lesson => lesson.id === decodedId);
  if (lesson) return lesson;

  // Try legacy format (with & instead of and)
  const legacyId = id.replace(/-and-/g, '-&-');
  lesson = lessons.find(lesson => lesson.id === legacyId);
  if (lesson) return lesson;

  // Try sanitized version (in case ID has special chars)
  const sanitizedId = id
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9-]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  lesson = lessons.find(lesson => lesson.id === sanitizedId);

  return lesson;
}

/**
 * Get source by ID
 */
export async function getSourceById(id: string): Promise<Source | undefined> {
  const sources = await getAllSources();
  return sources.find(source => source.id === id);
}

/**
 * Get lessons for a specific source
 */
export async function getLessonsBySourceId(sourceId: string): Promise<Lesson[]> {
  const source = await getSourceById(sourceId);
  return source?.lessons || [];
}

/**
 * Fallback sources (used if data file is not available)
 */
function getFallbackSources(): Source[] {
  return [
    {
      id: 'pragmatic-programmer',
      name: 'Pragmatic Programmer',
      source: 'Book: The Pragmatic Programmer',
      lessons: getFallbackLessons(),
    },
  ];
}

/**
 * Fallback lessons (minimal set for offline functionality)
 */
function getFallbackLessons(): Lesson[] {
  return [
    {
      id: 'pragmatic-programmer-taking-responsibility',
      sourceId: 'pragmatic-programmer',
      title: 'Taking Responsibility',
      subtitle: 'The Cat Ate My Source Code',
      description:
        "When things break, don't make excuses. Take responsibility, explain what happened, and help fix it.",
      concept: {
        title: 'The idea',
        content:
          'You know how in group projects, some people always blame others when things go wrong? "It\'s not my fault, the teacher didn\'t explain it right!" or "My partner didn\'t do their part!" Good engineers don\'t do that. When something breaks, they say: "Okay, here\'s what went wrong, and here\'s how we can fix it." No excuses. Just honesty and solutions. This makes people trust you, and problems get solved way faster.',
      },
      scenario: {
        title: 'Real-world scenario',
        content:
          'Imagine you\'re copying all your photos from your old phone to your new phone. Before you start, you should make sure you have a backup (like saving them to Google Photos first). If you skip this step and lose all your photos, you can\'t just say "the phone broke" or "I didn\'t have time to backup." A good engineer would say: "I should have backed up first. Let me check if we can recover the photos from the cloud or if there\'s another way to get them back." See the difference? One person makes excuses, the other person fixes the problem.',
      },
      applications: [
        'Copying files from one computer to another (like moving your music library)',
        'Setting up automatic tasks (like your phone backing up photos every night)',
        'When websites automatically test new features before showing them to users',
        'The hidden code that makes websites and apps work (like the engine in a car)',
      ],
      examples: [
        {
          language: 'python',
          code: `import os

def process_data(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError("Missing input file. Please verify the backup.")
    print("Processing data safely.")

try:
    process_data("customer_records.csv")
except Exception as e:
    print(f"Handled safely: {e}")`,
          executable: true,
        },
        {
          language: 'cpp',
          code: `#include <iostream>
#include <fstream>
#include <stdexcept>
#include <string>

void processData(const std::string& filePath) {
    std::ifstream file(filePath);
    if (!file.is_open()) {
        throw std::runtime_error("Missing input file. Verify backup.");
    }
    std::cout << "Processing data safely." << std::endl;
}

int main() {
    try {
        processData("customer_records.csv");
    } catch (const std::exception& e) {
        std::cerr << "Handled safely: " << e.what() << std::endl;
    }
    return 0;
}`,
          executable: true,
          compileNote: 'g++ -std=c++17 example.cpp -o example\n./example',
        },
      ],
    },
  ];
}

/**
 * Preload data (call this early in app initialization)
 */
export function preloadData(): void {
  initializeData().catch(error => {
    console.error('Failed to preload data:', error);
  });
}
