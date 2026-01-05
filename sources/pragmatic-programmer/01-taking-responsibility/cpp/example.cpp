#include <iostream>      // For printing to screen
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
}
