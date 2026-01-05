import { Source, Lesson } from '@/types';
import { loadSourcesFromFiles, loadAllLessonsFromFiles } from './sources-loader';

// Cache for loaded sources and lessons with TTL (Time To Live)
// This ensures content updates are reflected in production
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Disable cache completely to ensure fresh data in production
// This is important because file system access in serverless environments
// might have different behavior, and we want to always reload from files
const CACHE_TTL = 0; // Disabled - always reload from files

let cachedSources: CacheEntry<Source[]> | null = null;
let cachedLessons: CacheEntry<Lesson[]> | null = null;

/**
 * Check if cache is still valid
 */
function isCacheValid<T>(cache: CacheEntry<T> | null): boolean {
  if (!cache) return false;
  const now = Date.now();
  return (now - cache.timestamp) < CACHE_TTL;
}

/**
 * Clear the cache (useful for development or manual refresh)
 */
export function clearCache(): void {
  cachedSources = null;
  cachedLessons = null;
}

/**
 * Get all sources with their lessons
 */
export async function getAllSources(): Promise<Source[]> {
  // Check if cache is still valid
  if (isCacheValid(cachedSources)) {
    console.log('Using cached sources');
    return cachedSources!.data;
  }
  
  console.log('Loading sources from files...');
  const fileSources = await loadSourcesFromFiles();
  console.log(`Loaded ${fileSources.length} source(s) from files`);
  
  if (fileSources.length > 0) {
    fileSources.forEach(source => {
      console.log(`  - ${source.name}: ${source.lessons.length} lesson(s)`);
    });
    
    cachedSources = {
      data: fileSources,
      timestamp: Date.now(),
    };
    return fileSources;
  }
  
  console.log('No sources found in files, using default source');
  // Fallback to default source with hardcoded lessons
  return [getDefaultSource()];
}

/**
 * Get all lessons (flattened from all sources)
 */
export async function getAllLessons(): Promise<Lesson[]> {
  // Always reload from files (cache disabled)
  const fileLessons = await loadAllLessonsFromFiles();
  console.log(`Loaded ${fileLessons.length} lesson(s) from files`);
  
  if (fileLessons.length > 0) {
    // Update cache but it won't be used since TTL is 0
    cachedLessons = {
      data: fileLessons,
      timestamp: Date.now(),
    };
    return fileLessons;
  }
  
  // Fallback to hardcoded lessons
  return getHardcodedLessons();
}

/**
 * Get lesson by ID (searches across all sources)
 */
export async function getLessonById(id: string): Promise<Lesson | undefined> {
  const lessons = await getAllLessons();
  return lessons.find((lesson) => lesson.id === id);
}

/**
 * Get source by ID
 */
export async function getSourceById(id: string): Promise<Source | undefined> {
  const sources = await getAllSources();
  return sources.find((source) => source.id === id);
}

/**
 * Get lessons for a specific source
 */
export async function getLessonsBySourceId(sourceId: string): Promise<Lesson[]> {
  const source = await getSourceById(sourceId);
  return source?.lessons || [];
}

/**
 * Default source with hardcoded lessons (fallback)
 */
function getDefaultSource(): Source {
  return {
    id: 'pragmatic-programmer',
    name: 'Pragmatic Programmer',
    source: 'Book: The Pragmatic Programmer',
    lessons: getHardcodedLessons(),
  };
}

/**
 * Hardcoded lessons as fallback
 */
function getHardcodedLessons(): Lesson[] {
  return [
    {
      id: 'pragmatic-programmer-taking-responsibility',
      sourceId: 'pragmatic-programmer',
      title: 'Taking Responsibility',
      subtitle: 'The Cat Ate My Source Code',
      description:
        'When things break, don\'t make excuses. Take responsibility, explain what happened, and help fix it.',
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
# This lets us check if files exist on the computer


def process_data(file_path):
    # First, let's check if the file actually exists
    # This is like checking if you have your homework before trying to turn it in
    
    if not os.path.exists(file_path):
        # Oops! The file doesn't exist
        # Instead of crashing and saying "something went wrong",
        # we give a clear, helpful error message
        
        raise FileNotFoundError(
            "Missing input file. Please verify the backup."
        )

    # If we get here, the file exists! Now we can process it safely
    print("Processing data safely.")


# Now let's try to use this function
try:
    # "try" means "attempt this, but be ready if it fails"
    # Like trying to catch a ball - you might drop it, so be ready!
    
    process_data("customer_records.csv")
    # We're trying to process a file called "customer_records.csv"
    # If the file does not exist, the function will raise an error

except Exception as e:
    # "except" catches any errors that happen above
    # Instead of the program crashing, we handle it nicely
    
    print(f"Handled safely: {e}")
    # We print a clear message about what went wrong
    # This is taking responsibility - we're not hiding the problem!`,
          executable: true,
        },
        {
          language: 'cpp',
          code: `#include <iostream>      // For printing to screen
#include <fstream>       // For reading files
#include <stdexcept>     // For error handling
#include <string>        // For text/strings

void processData(const std::string& filePath) {
    // Try to open the file
    std::ifstream file(filePath);
    
    // Check if we actually opened it
    if (!file.is_open()) {
        // File doesn't exist! Instead of crashing, give a clear error
        throw std::runtime_error("Missing input file. Verify backup.");
    }

    // If we get here, the file exists! Process it safely
    std::cout << "Processing data safely." << std::endl;
}

int main() {
    try {
        // Try to process the file
        // "try" means "attempt this, but be ready if it fails"
        processData("customer_records.csv");
    } catch (const std::exception& e) {
        // "catch" handles any errors that happen above
        // Instead of crashing, we print a clear error message
        std::cerr << "Handled safely: " << e.what() << std::endl;
    }
    return 0;  // Everything finished!
}`,
          executable: true,
          compileNote: 'g++ -std=c++17 example.cpp -o example\n./example',
        },
      ],
    },
  ];
}
