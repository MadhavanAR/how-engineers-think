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
        'Imagine you\'re working on a group project. When something goes wrong, do you blame others or take responsibility? Professional engineers take ownership. Instead of making excuses like "the tool broke" or "there wasn\'t enough time," they say: "Here\'s what went wrong, and here\'s how we can fix it." This builds trust and helps solve problems faster.',
    },
    scenario: {
      title: 'Real-world scenario',
      content:
        'You\'re moving important files from an old computer to a new one (this is called a "data migration"). Before starting, you should check that you have backup copies. If you skip this step and something goes wrong, you can\'t just say "the computer broke" or "I didn\'t have time to check." Instead, you take responsibility: "I should have verified the backups first. Here\'s what we can do to recover the data." This honest approach helps fix the problem instead of wasting time on blame.',
    },
    applications: [
      'Moving data between systems (like copying files from old to new servers)',
      'Running scheduled tasks (like daily reports or backups)',
      'Automated testing and deployment (when code changes are automatically tested and released)',
      'Server-side applications (the behind-the-scenes code that powers websites and apps)',
    ],
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
        'Think of a broken window in a building. If no one fixes it, people start thinking "no one cares about this place." Soon, more windows get broken, graffiti appears, and the building falls into disrepair. The same happens with code! If you leave small problems unfixed (like error messages that keep appearing, or code that doesn\'t work properly), other developers think "no one cares about this code." They start being less careful, adding more problems, and the code quality gets worse and worse. Professional engineers fix small problems immediately, or at least put a temporary fix in place (like "boarding up" a broken window) to prevent things from getting worse.',
    },
    scenario: {
      title: 'Real-world scenario',
      content:
        'You have a piece of old code that\'s not being used anymore, but it still shows warning messages every time the program runs. It\'s not urgent, so you ignore it. A week later, there are 50 warning messages. Now when a real problem happens, you can\'t tell which warnings are important and which are just noise. The code starts to feel messy and broken, even though it still works. This is how small problems grow into big ones. The solution? Fix the warning right away, or at least make it stop showing up, so you can see real problems when they happen.',
    },
    applications: [
      'Automated systems that show warnings but no one fixes them (like a car dashboard light that keeps blinking)',
      'Old features that are no longer used but still cause errors (like an old button on a website that doesn\'t work anymore)',
      'Documentation that\'s out of date (like instructions that say "click here" but the button moved)',
      'Experimental features that were tested but never fully removed (like leaving test code in the final product)',
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
