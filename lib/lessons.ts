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
];

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

export function getAllLessons(): Lesson[] {
  return lessons;
}
