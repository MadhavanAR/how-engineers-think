/**
 * Build-time script to generate lessons.json from sources directory
 * This allows the frontend to load all lesson data without API calls
 */

const fs = require('fs').promises;
const path = require('path');

// Simple markdown parser
function parseReadme(content) {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled Lesson';

  const subtitleMatch = content.match(/^#\s+.+\n\n##\s+(.+)$/m);
  const subtitle = subtitleMatch ? subtitleMatch[1].trim() : '';

  const descriptionMatch = content.match(/^#\s+.+\n\n(?:##\s+.+\n\n)?(.+?)(?=\n##)/s);
  const description = descriptionMatch ? descriptionMatch[1].trim().split('\n\n')[0].trim() : '';

  const ideaMatch = content.match(/##\s+[Tt]he idea\s*\n\n(.+?)(?=\n##|\n###|$)/s);
  const ideaContent = ideaMatch ? ideaMatch[1].trim() : '';

  const scenarioMatch = content.match(/##\s+[Rr]eal-world scenario\s*\n\n(.+?)(?=\n##|\n###|$)/s);
  const scenarioContent = scenarioMatch ? scenarioMatch[1].trim() : '';

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
    applications:
      applications.length > 0
        ? applications
        : ['Real-world software development', 'Team collaboration', 'Code quality practices'],
  };
}

async function readCodeFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content.trim();
  } catch {
    return null;
  }
}

// Sanitize lesson ID to be URL-safe
function sanitizeLessonId(id) {
  return id
    .replace(/&/g, 'and') // Replace & with 'and'
    .replace(/[^a-z0-9-]/gi, '-') // Replace special chars with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

async function loadLesson(lessonDir, lessonId, sourceId) {
  try {
    const readmePath = path.join(lessonDir, 'README.md');
    let readmeContent;

    try {
      readmeContent = await fs.readFile(readmePath, 'utf-8');
    } catch (error) {
      console.warn(`Warning: Could not read README.md in ${lessonDir}`);
      return null;
    }

    const metadata = parseReadme(readmeContent);

    const examples = [];

    // Try to load Python example
    const pythonPath = path.join(lessonDir, 'python', 'example.py');
    const pythonCode = await readCodeFile(pythonPath);
    if (pythonCode) {
      examples.push({
        language: 'python',
        code: pythonCode,
        executable: true,
      });
    }

    // Try to load C++ example
    const cppPath = path.join(lessonDir, 'cpp', 'example.cpp');
    const cppCode = await readCodeFile(cppPath);
    if (cppCode) {
      examples.push({
        language: 'cpp',
        code: cppCode,
        executable: true,
        compileNote: 'g++ -std=c++17 example.cpp -o example\n./example',
      });
    }

    // Sanitize the lesson ID to be URL-safe
    const sanitizedId = sanitizeLessonId(lessonId);

    return {
      id: sanitizedId,
      sourceId,
      title: metadata.title,
      subtitle: metadata.subtitle,
      description: metadata.description,
      concept: metadata.concept,
      scenario: metadata.scenario,
      applications: metadata.applications,
      examples,
    };
  } catch (error) {
    console.error(`Error loading lesson from ${lessonDir}:`, error);
    return null;
  }
}

async function loadSource(sourceDir, sourceId) {
  try {
    const sourceMdPath = path.join(sourceDir, 'SOURCE.md');
    let sourceName = sourceId;
    let sourceDescription = '';

    try {
      const sourceContent = await fs.readFile(sourceMdPath, 'utf-8');
      const nameMatch = sourceContent.match(/^#\s+(.+)$/m);
      if (nameMatch) {
        sourceName = nameMatch[1].trim();
      }
    } catch {
      // SOURCE.md is optional
    }

    const lessons = [];
    const entries = await fs.readdir(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        const lessonDir = path.join(sourceDir, entry.name);
        const lessonId = `${sourceId}-${entry.name}`;
        const lesson = await loadLesson(lessonDir, lessonId, sourceId);
        if (lesson) {
          lessons.push(lesson);
        }
      }
    }

    return {
      id: sourceId,
      name: sourceName,
      source: sourceDescription || undefined,
      lessons: lessons.sort((a, b) => a.id.localeCompare(b.id)),
    };
  } catch (error) {
    console.error(`Error loading source from ${sourceDir}:`, error);
    return null;
  }
}

async function generateLessonsJson() {
  try {
    const sourcesDir = path.join(process.cwd(), 'sources');
    const outputPath = path.join(process.cwd(), 'public', 'data', 'lessons.json');

    // Check if sources directory exists
    try {
      await fs.access(sourcesDir);
    } catch {
      console.warn('Sources directory not found, creating empty data file');
      const outputDir = path.dirname(outputPath);
      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(
        outputPath,
        JSON.stringify(
          { sources: [], lessons: [], generatedAt: new Date().toISOString() },
          null,
          2
        ),
        'utf-8'
      );
      return;
    }

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });

    // Load all sources
    const sources = [];
    const entries = await fs.readdir(sourcesDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        const sourceDir = path.join(sourcesDir, entry.name);
        // Preserve first letter capitalization, lowercase the rest
        const sourceId =
          entry.name.charAt(0) + entry.name.slice(1).toLowerCase().replace(/\s+/g, '-');
        const source = await loadSource(sourceDir, sourceId);
        if (source) {
          sources.push(source);
        }
      }
    }

    // Flatten all lessons
    const lessons = sources.flatMap(source => source.lessons);

    const data = {
      sources,
      lessons,
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
    };

    await fs.writeFile(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(
      `✓ Generated lessons.json with ${sources.length} sources and ${lessons.length} lessons`
    );
    console.log(`  Output: ${outputPath}`);
  } catch (error) {
    console.error('Failed to generate lessons.json:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateLessonsJson();
}

module.exports = { generateLessonsJson };
