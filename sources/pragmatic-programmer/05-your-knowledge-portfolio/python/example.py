# Your Knowledge Portfolio - Python Example
# This shows how learning different languages gives you better tools

# Task: Read a log file and print lines containing "ERROR"
# This is a simple task that shows the power of diversifying your knowledge

# Python makes this task very simple and readable
# If you only knew Java, this same task would take many more lines
# Learning Python expands your thinking and gives you a better tool for quick tasks

# Sample log data (in real life, this would come from a file)
log_data = """2024-01-15 10:30:15 INFO: Server started successfully
2024-01-15 10:31:22 ERROR: Database connection failed
2024-01-15 10:32:10 INFO: User logged in
2024-01-15 10:33:45 ERROR: Failed to process payment
2024-01-15 10:34:20 WARNING: High memory usage detected
2024-01-15 10:35:00 INFO: Request completed"""

# Process the log data line by line
# In real code, you'd use: with open("server.log") as f:
# But for this example, we use the string directly
for line in log_data.split('\n'):
    # Go through each line
    # Python makes this very simple - no need for complex setup
    
    if "ERROR" in line:
        # Check if the line contains "ERROR"
        # Simple and readable!
        
        print(line)
        # Print the error line

# This is why diversifying your knowledge matters:
# - Python is great for quick scripts and data processing
# - Java is great for large, complex applications
# - Knowing both lets you choose the right tool for each job
# - Your knowledge portfolio is diversified and valuable!
