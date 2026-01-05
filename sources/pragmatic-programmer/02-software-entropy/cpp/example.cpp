#include <iostream>
#include <string>

// This is old, broken code that's still in the system
// It's like that broken window - we need to fix it!
std::string getLegacyData() {
    // THE PROBLEM: This function could crash randomly
    // THE FIX: Instead of crashing, return something safe
    // This is "boarding up the broken window"
    return "inactive";
}

int main() {
    // This is NEW code we're writing
    // It needs to use the old function above
    
    std::string legacyStatus = getLegacyData();
    // Because we "boarded up" the broken window above,
    // this new code works without errors

    std::cout << "Legacy status: " << legacyStatus << std::endl;
    return 0;
}
