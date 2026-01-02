import { Lesson } from '@/types';

export const lessons: Lesson[] = [
  {
    id: 'taking-responsibility',
    title: 'Taking Responsibility',
    subtitle: 'The Cat Ate My Source Code',
    description:
      'Professional engineers own outcomes, not excuses. When something fails, the job is to explain what went wrong and propose clear options to move forward.',
    concept: {
      title: 'The idea',
      content:
        'Professional engineers own outcomes, not excuses. When something fails, the job is to explain what went wrong and propose clear options to move forward.',
    },
    scenario: {
      title: 'Real-world scenario',
      content:
        'A data migration fails because backups were not verified. Blaming tools or timelines does not help. Owning the mistake and offering recovery options does.',
    },
    applications: ['Data migrations', 'Batch jobs', 'CI/CD pipelines', 'Backend services'],
    examples: [
      {
        language: 'python',
        code: `import os
# We use OS to check whether a file exists or not


def process_data(file_path):

    if not os.path.exists(file_path):
        # Does this file actually exist on the system?
        # This is a responsibility check before doing work

        raise FileNotFoundError(
            "Missing input file. Please verify the backup."
        )
        # Instead of letting the program crash silently,
        # we fail early with a clear, meaningful error message

    print("Processing data safely.")
    # This line runs only if the file exists
    # It represents successful processing


try:
    # try block is used to handle risky operations safely
    # Any error inside this block can be caught below

    process_data("customer_records.csv")
    # We are calling the function with a file name
    # If the file does not exist, an exception will be raised

except Exception as e:
    # This block catches ANY error that occurs above
    # Instead of crashing, we handle it gracefully

    print(f"Handled safely: {e}")
    # We log the error clearly
    # This is an example of taking responsibility in code`,
        executable: true,
      },
      {
        language: 'cpp',
        code: `#include <iostream>      // console output
#include <fstream>       // file handling
#include <stdexcept>     // runtime errors
#include <string>        // string support

void processData(const std::string& filePath) {
    std::ifstream file(filePath);                 // attempt to open file
    if (!file.is_open())                          // verify resource availability
        throw std::runtime_error("Missing input file. Verify backup.");

    std::cout << "Processing data safely." << std::endl;  // proceed only if safe
}

int main() {
    try {
        processData("customer_records.csv");       // attempt processing
    } catch (const std::exception& e) {
        std::cerr << "Handled safely: " << e.what() << std::endl;  // clear failure handling
    }
    return 0;                                      // clean exit
}`,
        executable: true,
        compileNote: 'g++ -std=c++17 example.cpp -o example\n./example',
      },
    ],
  },
  {
    id: 'software-entropy',
    title: 'Software Entropy',
    subtitle: 'Broken Windows',
    description:
      'Small neglected issues signal that no one cares. Once that signal exists, code quality decays rapidly. Professional engineers fix small problems early, or temporarily "board them up" to prevent further damage.',
    concept: {
      title: 'The idea',
      content:
        'Small neglected issues signal that no one cares. Once that signal exists, code quality decays rapidly. Professional engineers fix small problems early, or temporarily "board them up" to prevent further damage.',
    },
    scenario: {
      title: 'Real-world scenario',
      content:
        'An unused function causes warnings in logs. It\'s not part of today\'s task, so it gets ignored. Soon: warnings pile up, real errors are missed, the codebase feels abandoned.',
    },
    applications: [
      'CI/CD pipelines with ignored warnings',
      'Deprecated API endpoints left running forever',
      'Outdated README files',
      'Feature flags that never get removed',
    ],
    examples: [
      {
        language: 'python',
        code: `# This file demonstrates how small ignored issues
# slowly degrade code quality (software entropy).


def get_legacy_data():
    # This function represents old, fragile code
    # that is no longer reliable but still exists.

    # BROKEN WINDOW:
    # Leaving this function to fail randomly
    # creates noise and makes the system feel neglected.

    # Pragmatic approach:
    # If we cannot fix it fully today, we "board it up"
    # so it stops causing damage.

    return {
        "status": "inactive",
        "data": None
    }
    # Returning a safe fallback prevents warnings,
    # avoids confusion, and stops the rot from spreading.


def get_user_profile():
    # This is new code being added today.
    # It depends on older parts of the system.

    legacy = get_legacy_data()
    # Because the broken window was handled,
    # new code stays clean and predictable.

    return {
        "user": "example",
        "legacy_status": legacy["status"]
    }


print(get_user_profile())
# Output is stable and logs stay clean.`,
        executable: true,
      },
      {
        language: 'cpp',
        code: `#include <iostream>
#include <string>

// Legacy function that is unstable and not ready for use
std::string getLegacyData() {
    // Broken window:
    // Instead of failing unpredictably,
    // we return a safe placeholder.
    return "inactive";
}

int main() {
    // New code depends on old systems
    std::string legacyStatus = getLegacyData();

    std::cout << "Legacy status: " << legacyStatus << std::endl;
    return 0;
}`,
        executable: true,
        compileNote: 'g++ -std=c++17 example.cpp -o example\n./example',
      },
    ],
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

export function getAllLessons(): Lesson[] {
  return lessons;
}
