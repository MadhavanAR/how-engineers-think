import { promises as fs } from 'fs';
import { join } from 'path';
import { Source, Lesson, CodeExample } from '@/types';

interface LessonMetadata {
  title: string;
  subtitle: string;
  description: string;
  concept: {
    title: string;
    content: string;
  };
  scenario: {
    title: string;
    content: string;
  };
  applications: string[];
}

/**
 * Parse README.md to extract lesson metadata
 */
function parseReadme(content: string): LessonMetadata {
  // Extract title (first # heading)
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled Lesson';
  
  // Extract subtitle (first ## heading after title)
  const subtitleMatch = content.match(/^#\s+.+\n\n##\s+(.+)$/m);
  const subtitle = subtitleMatch ? subtitleMatch[1].trim() : '';
  
  // Extract description (first paragraph after title/subtitle, before first ##)
  const descriptionMatch = content.match(/^#\s+.+\n\n(?:##\s+.+\n\n)?(.+?)(?=\n##)/s);
  const description = descriptionMatch 
    ? descriptionMatch[1].trim().split('\n\n')[0].trim()
    : '';
  
  // Extract "The idea" section
  const ideaMatch = content.match(/##\s+[Tt]he idea\s*\n\n(.+?)(?=\n##|\n###|$)/s);
  const ideaContent = ideaMatch ? ideaMatch[1].trim() : '';
  
  // Extract "Real-world scenario" section
  const scenarioMatch = content.match(/##\s+[Rr]eal-world scenario\s*\n\n(.+?)(?=\n##|\n###|$)/s);
  const scenarioContent = scenarioMatch ? scenarioMatch[1].trim() : '';
  
  // Extract applications
  const applicationsMatch = content.match(/##\s+Where.*?\n\n(.+?)(?=\n##|\n###|$)/s);
  const applicationsText = applicationsMatch ? applicationsMatch[1] : '';
  const applications = applicationsText
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      return trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•');
    })
    .map(line => line.replace(/^[-*•]\s+/, '').trim())
    .filter(Boolean);
  
  return {
    title,
    subtitle,
    description: description || ideaContent.split('\n')[0] || '',
    concept: {
      title: 'The idea',
      content: ideaContent || 'No description provided.',
    },
    scenario: {
      title: 'Real-world scenario',
      content: scenarioContent || 'No scenario provided.',
    },
    applications: applications.length > 0 ? applications : [
      'Real-world software development',
      'Team collaboration',
      'Code quality practices',
    ],
  };
}

/**
 * Read code file
 */
async function readCodeFile(filePath: string): Promise<string | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content.trim();
  } catch {
    return null;
  }
}

/**
 * Load a single lesson from directory
 */
async function loadLesson(lessonDir: string, lessonId: string, sourceId: string): Promise<Lesson | null> {
  try {
    const readmePath = join(lessonDir, 'README.md');
    let readmeContent: string;
    
    try {
      readmeContent = await fs.readFile(readmePath, 'utf-8');
    } catch (error) {
      console.warn(`No README.md found in ${lessonDir}:`, error);
      return null;
    }
    
    const metadata = parseReadme(readmeContent);
    
    // Read code examples
    const examples: CodeExample[] = [];
    
    const pythonPath = join(lessonDir, 'python', 'example.py');
    const pythonCode = await readCodeFile(pythonPath);
    if (pythonCode) {
      examples.push({
        language: 'python',
        code: pythonCode,
        executable: true,
      });
    } else {
      console.warn(`Python example not found or empty: ${pythonPath}`);
    }
    
    const cppPath = join(lessonDir, 'cpp', 'example.cpp');
    const cppCode = await readCodeFile(cppPath);
    if (cppCode) {
      examples.push({
        language: 'cpp',
        code: cppCode,
        executable: true,
        compileNote: 'g++ -std=c++17 example.cpp -o example\n./example',
      });
    } else {
      console.warn(`C++ example not found or empty: ${cppPath}`);
    }
    
    if (examples.length === 0) {
      console.error(`No code examples found in ${lessonDir}. Python: ${pythonPath}, C++: ${cppPath}`);
      return null;
    }
    
    console.log(`Successfully loaded lesson: ${lessonId} with ${examples.length} example(s)`);
    
    return {
      id: lessonId,
      sourceId,
      ...metadata,
      examples,
    };
  } catch (error) {
    console.error(`Error loading lesson from ${lessonDir}:`, error);
    return null;
  }
}

/**
 * Load all sources and their lessons
 */
// Helper function to find the sources directory
async function findSourcesDir(): Promise<string | null> {
  const possiblePaths = [
    join(process.cwd(), 'sources'),
    join(process.cwd(), '..', 'sources'),
    join(__dirname, '..', 'sources'),
    join(__dirname, '..', '..', 'sources'),
  ];
  
  for (const path of possiblePaths) {
    try {
      await fs.access(path);
      console.log(`Found sources directory at: ${path}`);
      return path;
    } catch {
      // Continue to next path
    }
  }
  
  console.error(`Sources directory not found. Tried paths:`, possiblePaths);
  return null;
}

export async function loadSourcesFromFiles(): Promise<Source[]> {
  try {
    // Find the sources directory (handles different deployment environments)
    const sourcesDir = await findSourcesDir();
    
    if (!sourcesDir) {
      console.error(`Could not find sources directory. Current working directory: ${process.cwd()}`);
      return [];
    }
    
    console.log(`Loading sources from: ${sourcesDir}`);
    
    // Read all source directories
    const entries = await fs.readdir(sourcesDir, { withFileTypes: true });
    const sourceDirs = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort();
    
    const sources: Source[] = [];
    
    // Load each source
    for (const sourceDirName of sourceDirs) {
      const sourceDir = join(sourcesDir, sourceDirName);
      const sourceId = sourceDirName.toLowerCase().replace(/\s+/g, '-');
      
      // Try to read source metadata (optional)
      let source: string | undefined;
      try {
        const metadataPath = join(sourceDir, 'SOURCE.md');
        const metadataContent = await fs.readFile(metadataPath, 'utf-8');
        const sourceMatch = metadataContent.match(/source:\s*(.+)/i);
        if (sourceMatch) {
          source = sourceMatch[1].trim();
        }
      } catch {
        // No metadata file, that's okay
      }
      
      // Read lesson directories within this source
      const lessonEntries = await fs.readdir(sourceDir, { withFileTypes: true });
      const lessonDirs = lessonEntries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .sort();
      
      const lessons: Lesson[] = [];
      
      // Load each lesson in this source
      for (const lessonDirName of lessonDirs) {
        const lessonDir = join(sourceDir, lessonDirName);
        const lessonId = `${sourceId}-${lessonDirName.replace(/^\d+-/, '').toLowerCase()}`;
        
        console.log(`Attempting to load lesson: ${lessonDirName} (ID: ${lessonId})`);
        const lesson = await loadLesson(lessonDir, lessonId, sourceId);
        if (lesson) {
          lessons.push(lesson);
          console.log(`✓ Loaded lesson: ${lesson.title}`);
        } else {
          console.error(`✗ Failed to load lesson: ${lessonDirName}`);
        }
      }
      
      console.log(`Total lessons loaded for ${sourceDirName}: ${lessons.length} out of ${lessonDirs.length} directories`);
      
      if (lessons.length > 0) {
        sources.push({
          id: sourceId,
          name: sourceDirName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          source,
          lessons,
        });
      }
    }
    
    return sources;
  } catch (error) {
    console.error('Error loading sources from files:', error);
    return [];
  }
}

/**
 * Get all lessons from all sources (flattened)
 */
export async function loadAllLessonsFromFiles(): Promise<Lesson[]> {
  const sources = await loadSourcesFromFiles();
  return sources.flatMap(source => source.lessons);
}
