#include <iostream>  // For printing to screen
#include <fstream>   // For reading files
#include <string>    // For text/strings
#include <sstream>   // For string streams

// Your Knowledge Portfolio - C++ Example
// This shows how different languages solve the same problem differently

// Task: Read a log file and print lines containing "ERROR"
// C++ gives you more control but requires more code
// This is why learning multiple languages is valuable - you can choose the right tool

int main() {
    // Sample log data (in real life, this would come from a file)
    // For this example, we use a string to demonstrate the concept
    std::string logData = 
        "2024-01-15 10:30:15 INFO: Server started successfully\n"
        "2024-01-15 10:31:22 ERROR: Database connection failed\n"
        "2024-01-15 10:32:10 INFO: User logged in\n"
        "2024-01-15 10:33:45 ERROR: Failed to process payment\n"
        "2024-01-15 10:34:20 WARNING: High memory usage detected\n"
        "2024-01-15 10:35:00 INFO: Request completed";
    
    // Process the log data line by line
    // In real code, you'd use: std::ifstream file("server.log");
    std::istringstream logStream(logData);
    std::string line;
    
    // Read the log data line by line
    while (std::getline(logStream, line)) {
        // Check if this line contains "ERROR"
        if (line.find("ERROR") != std::string::npos) {
            // Print the error line
            std::cout << line << std::endl;
        }
    }
    
    return 0;  // Success!
}

// Why this matters for your knowledge portfolio:
// - C++ gives you fine control and high performance
// - Python is simpler for quick tasks
// - Java is good for large enterprise applications
// - Learning all three makes you valuable because you can choose the right tool
// - Your knowledge doesn't expire because you keep learning new things!
