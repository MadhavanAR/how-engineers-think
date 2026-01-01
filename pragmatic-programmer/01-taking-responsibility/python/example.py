import os
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
    # This is an example of taking responsibility in code