#include <iostream>      // console output
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
}