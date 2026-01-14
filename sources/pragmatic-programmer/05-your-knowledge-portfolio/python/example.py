# Your Knowledge Portfolio - Python Example
# This shows how learning different languages gives you better tools

# Task: Read a log file and print lines containing "ERROR"
# This is a simple task that shows the power of diversifying your knowledge

# Python makes this task very simple and readable
# If you only knew Java, this same task would take many more lines
# Learning Python expands your thinking and gives you a better tool for quick tasks

with open("server.log") as f:
    # "with open" automatically handles closing the file
    # This is like having a smart assistant that cleans up after you
    
    for line in f:
        # Go through each line in the file
        # Python makes this very simple - no need for complex setup
        
        if "ERROR" in line:
            # Check if the line contains "ERROR"
            # Simple and readable!
            
            print(line, end='')
            # Print the line (end='' prevents extra blank lines)

# This is why diversifying your knowledge matters:
# - Python is great for quick scripts and data processing
# - Java is great for large, complex applications
# - Knowing both lets you choose the right tool for each job
# - Your knowledge portfolio is diversified and valuable!
