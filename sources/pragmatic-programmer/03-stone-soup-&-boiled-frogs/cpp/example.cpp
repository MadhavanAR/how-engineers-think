#include <iostream>

// Day 3: Stone Soup and Boiled Frogs
// Logic still works, but complexity increases gradually.

double calculatePrice(double basePrice, bool sale, bool vip, bool international) {
    double price = basePrice;

    if (sale) {
        price *= 0.9;
    }

    if (vip) {
        price *= 0.8;
    }

    if (international) {
        price += 10;
    }

    // growing conditionals signal slow decay
    return price;
}

int main() {
    double finalPrice = calculatePrice(100, true, true, true);
    std::cout << finalPrice << std::endl;
    return 0;
}