import os
# This lets us check if files exist on the computer


def process_data(file_path):
    # First, let's check if the file actually exists
    # This is like checking if you have your homework before trying to turn it in
    
    if not os.path.exists(file_path):
        # Oops! The file doesn't exist
        # Instead of crashing and saying "something went wrong",
        # we give a clear, helpful error message
        
        raise FileNotFoundError(
            "Missing input file. Please verify the backup."
        )

    # If we get here, the file exists! Now we can process it safely
    print("Processing data safely.")


# Now let's try to use this function
try:
    # "try" means "attempt this, but be ready if it fails"
    # Like trying to catch a ball - you might drop it, so be ready!
    
    process_data("customer_records.csv")
    # We're trying to process a file called "customer_records.csv"
    # If the file does not exist, the function will raise an error

except Exception as e:
    # "except" catches any errors that happen above
    # Instead of the program crashing, we handle it nicely
    
    print(f"Handled safely: {e}")
    # We print a clear message about what went wrong
    # This is taking responsibility - we're not hiding the problem!
