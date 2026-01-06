# Day 4: Good-Enough Software
# This code does exactly what it needs to do - no more, no less.
# It's simple, clear, and works correctly. That's "good enough"!


def calculate_discount(price, discount_percent):
    # This function calculates the final price after a discount
    # It's straightforward and does the job - no fancy features needed!
    # Like a simple calculator: you put in numbers, you get the answer
    
    return price * (1 - discount_percent)
    # This is the math: original price minus the discount percentage
    # For example: $100 with 20% off = $100 * (1 - 0.2) = $80


# Let's use our function
final_price = calculate_discount(100, 0.2)
# We're calculating: $100 item with 20% discount

print(final_price)
# This prints the result: 80.0

# See? Simple, clear, and it works!
# We could add fancy features like:
# - Handling multiple discounts
# - Currency formatting
# - Tax calculations
# - Error checking for invalid inputs
# 
# But for now, this is "good enough" - it solves the problem!

