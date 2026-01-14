#include <iostream>  // For printing to screen
#include <fstream>   // For reading files
#include <string>    // For text/strings

// Your Knowledge Portfolio - C++ Example
// This shows how different languages solve the same problem differently

// Task: Read a log file and print lines containing "ERROR"
// C++ gives you more control but requires more code
// This is why learning multiple languages is valuable - you can choose the right tool

int main() {
    // Open the file
    std::ifstream file("server.log");
    
    // Check if the file opened successfully
    if (!file.is_open()) {
        std::cerr << "Could not open server.log" << std::endl;
        return 1;  // Exit with error code
    }
    
    std::string line;
    // Read the file line by line
    while (std::getline(file, line)) {
        // Check if this line contains "ERROR"
        if (line.find("ERROR") != std::string::npos) {
            // Print the line
            std::cout << line << std::endl;
        }
    }
    
    // File is automatically closed when it goes out of scope
    // (C++ handles cleanup automatically)
    
    return 0;  // Success!
}

// Why this matters for your knowledge portfolio:
// - C++ gives you fine control and high performance
// - Python is simpler for quick tasks
// - Java is good for large enterprise applications
// - Learning all three makes you valuable because you can choose the right tool
// - Your knowledge doesn't expire because you keep learning new things!
