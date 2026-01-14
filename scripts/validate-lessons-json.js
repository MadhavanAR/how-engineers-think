/**
 * Validate lessons.json structure and content
 * Ensures data integrity before deployment
 */

const fs = require('fs').promises;
const path = require('path');

const REQUIRED_LESSON_FIELDS = [
  'id',
  'sourceId',
  'title',
  'description',
  'concept',
  'scenario',
  'applications',
];
const REQUIRED_SOURCE_FIELDS = ['id', 'name', 'lessons'];

async function validateLessonsJson() {
  const jsonPath = path.join(process.cwd(), 'public', 'data', 'lessons.json');

  try {
    const content = await fs.readFile(jsonPath, 'utf-8');
    const data = JSON.parse(content);

    const errors = [];
    const warnings = [];

    // Validate structure
    if (!data.sources || !Array.isArray(data.sources)) {
      errors.push('Missing or invalid "sources" array');
    }

    if (!data.lessons || !Array.isArray(data.lessons)) {
      errors.push('Missing or invalid "lessons" array');
    }

    if (errors.length > 0) {
      console.error('❌ Validation errors:');
      errors.forEach(err => console.error(`  - ${err}`));
      process.exit(1);
    }

    // Validate sources
    data.sources.forEach((source, index) => {
      REQUIRED_SOURCE_FIELDS.forEach(field => {
        if (!source[field]) {
          errors.push(
            `Source ${index + 1} (${source.id || 'unknown'}): Missing required field "${field}"`
          );
        }
      });

      if (source.lessons && !Array.isArray(source.lessons)) {
        errors.push(`Source ${index + 1}: "lessons" must be an array`);
      }
    });

    // Validate lessons
    const lessonIds = new Set();
    data.lessons.forEach((lesson, index) => {
      // Check for duplicate IDs
      if (lessonIds.has(lesson.id)) {
        errors.push(`Lesson ${index + 1}: Duplicate ID "${lesson.id}"`);
      }
      lessonIds.add(lesson.id);

      // Check required fields
      REQUIRED_LESSON_FIELDS.forEach(field => {
        if (!lesson[field]) {
          errors.push(
            `Lesson ${index + 1} (${lesson.id || 'unknown'}): Missing required field "${field}"`
          );
        }
      });

      // Validate concept structure
      if (lesson.concept && (!lesson.concept.title || !lesson.concept.content)) {
        warnings.push(`Lesson "${lesson.id}": Concept should have both "title" and "content"`);
      }

      // Validate scenario structure
      if (lesson.scenario && (!lesson.scenario.title || !lesson.scenario.content)) {
        warnings.push(`Lesson "${lesson.id}": Scenario should have both "title" and "content"`);
      }

      // Validate examples
      if (lesson.examples && Array.isArray(lesson.examples)) {
        lesson.examples.forEach((example, exIndex) => {
          if (!example.language || !example.code) {
            errors.push(`Lesson "${lesson.id}": Example ${exIndex + 1} missing language or code`);
          }
          if (!['python', 'cpp'].includes(example.language)) {
            errors.push(
              `Lesson "${lesson.id}": Example ${exIndex + 1} has invalid language "${example.language}"`
            );
          }
        });
      }
    });

    // Check for orphaned lessons (lessons not in any source)
    const sourceLessonIds = new Set();
    data.sources.forEach(source => {
      if (source.lessons) {
        source.lessons.forEach(lesson => sourceLessonIds.add(lesson.id));
      }
    });

    data.lessons.forEach(lesson => {
      if (!sourceLessonIds.has(lesson.id)) {
        warnings.push(`Lesson "${lesson.id}" is not referenced in any source`);
      }
    });

    if (errors.length > 0) {
      console.error('❌ Validation failed:');
      errors.forEach(err => console.error(`  - ${err}`));
      process.exit(1);
    }

    if (warnings.length > 0) {
      console.warn('⚠️  Validation warnings:');
      warnings.forEach(warn => console.warn(`  - ${warn}`));
    }

    console.log(`✓ Validation passed:`);
    console.log(`  - ${data.sources.length} source(s)`);
    console.log(`  - ${data.lessons.length} lesson(s)`);
    console.log(
      `  - ${data.lessons.reduce((sum, l) => sum + (l.examples?.length || 0), 0)} code example(s)`
    );
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`❌ File not found: ${jsonPath}`);
      console.error('Run "npm run build" first to generate lessons.json');
    } else if (error instanceof SyntaxError) {
      console.error(`❌ Invalid JSON: ${error.message}`);
    } else {
      console.error(`❌ Validation error: ${error.message}`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  validateLessonsJson();
}

module.exports = { validateLessonsJson };
