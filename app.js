// Lesson data structure
const lessons = {
    'taking-responsibility': {
        title: 'Taking Responsibility',
        subtitle: 'The Cat Ate My Source Code',
        description: 'Professional engineers own outcomes, not excuses. When something fails, the job is to explain what went wrong and propose clear options to move forward.',
        concept: 'The idea',
        conceptText: 'Professional engineers own outcomes, not excuses. When something fails, the job is to explain what went wrong and propose clear options to move forward.',
        scenario: 'Real-world scenario',
        scenarioText: 'A data migration fails because backups were not verified. Blaming tools or timelines does not help. Owning the mistake and offering recovery options does.',
        applications: [
            'Data Migrations',
            'Batch Jobs',
            'CI/CD Pipelines',
            'Backend Services'
        ],
        examples: [
            {
                language: 'Python',
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
                executable: true
            },
            {
                language: 'C++',
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
                executable: false,
                compileNote: 'g++ -std=c++17 example.cpp -o example\n./example'
            }
        ]
    }
};

let pyodide = null;

// Initialize Pyodide
async function initPyodide() {
    if (!pyodide) {
        pyodide = await loadPyodide();
    }
    return pyodide;
}

// Execute Python code
async function runPython(code, outputElement) {
    outputElement.textContent = '';
    outputElement.className = 'output';
    
    const loading = document.createElement('span');
    loading.className = 'loading';
    outputElement.appendChild(loading);
    
    try {
        await initPyodide();
        
        // Capture stdout
        let output = '';
        pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);
        
        // Run the code
        pyodide.runPython(code);
        
        // Get output
        const stdout = pyodide.runPython('sys.stdout.getvalue()');
        const stderr = pyodide.runPython('sys.stderr.getvalue()');
        
        outputElement.removeChild(loading);
        
        if (stderr) {
            outputElement.textContent = stderr;
            outputElement.className = 'output error';
        } else if (stdout) {
            outputElement.textContent = stdout;
            outputElement.className = 'output success';
        } else {
            outputElement.textContent = 'Code executed successfully (no output)';
            outputElement.className = 'output';
        }
    } catch (error) {
        outputElement.removeChild(loading);
        outputElement.textContent = `Error: ${error.message}`;
        outputElement.className = 'output error';
    }
}

// Render lesson content
function renderLesson(lessonId) {
    const lesson = lessons[lessonId];
    if (!lesson) return;
    
    const content = document.getElementById('lessonContent');
    
    let html = `
        <div class="lesson-view">
            <div class="lesson-header">
                <h2>${lesson.title}</h2>
                <p class="subtitle">${lesson.subtitle}</p>
                <p class="description">${lesson.description}</p>
            </div>
            
            <div class="concept-section">
                <h3>${lesson.concept}</h3>
                <p>${lesson.conceptText}</p>
            </div>
            
            <div class="concept-section">
                <h3>${lesson.scenario}</h3>
                <p>${lesson.scenarioText}</p>
            </div>
            
            <div class="concept-section">
                <h3>Where this shows up in real systems</h3>
                <ul>
                    ${lesson.applications.map(app => `<li>${app}</li>`).join('')}
                </ul>
            </div>
            
            <div class="code-examples">
    `;
    
    lesson.examples.forEach((example, index) => {
        const exampleId = `${lessonId}-${index}`;
        html += `
            <div class="code-example">
                <div class="code-header">
                    <h4>${example.language}</h4>
                    ${example.executable ? 
                        `<button class="run-button" onclick="runCode('${exampleId}')">Run</button>` : 
                        ''}
                </div>
                <div class="code-block">
                    <pre class="code-content">${escapeHtml(example.code)}</pre>
                </div>
                <div class="output empty" id="output-${exampleId}">Click "Run" to execute the code</div>
                ${example.compileNote ? `
                    <div class="cpp-note">
                        <strong>To compile and run:</strong><br>
                        <code>${example.compileNote.replace(/\n/g, '<br>')}</code>
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    content.innerHTML = html;
    
    // Store code for execution
    lesson.examples.forEach((example, index) => {
        const exampleId = `${lessonId}-${index}`;
        window[`code_${exampleId}`] = example.code;
    });
}

// Run code handler
window.runCode = async function(exampleId) {
    const code = window[`code_${exampleId}`];
    const outputElement = document.getElementById(`output-${exampleId}`);
    const button = outputElement.previousElementSibling.previousElementSibling.querySelector('.run-button');
    
    if (!code) return;
    
    button.disabled = true;
    button.textContent = 'Running...';
    
    await runPython(code, outputElement);
    
    button.disabled = false;
    button.textContent = 'Run';
};

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Navigation
document.querySelectorAll('.lesson-card').forEach(card => {
    card.addEventListener('click', () => {
        const lessonId = card.dataset.lesson;
        renderLesson(lessonId);
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Pre-load Pyodide in background
    initPyodide().catch(console.error);
});
