#include <iostream>
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
}