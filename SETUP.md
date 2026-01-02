# Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Verify prerequisites:**
   ```bash
   # Check Python
   python3 --version
   
   # Check C++ compiler
   g++ --version
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to `http://localhost:3000`

## System Requirements

- **Node.js**: 18.0.0 or higher
- **Python**: 3.x (for Python code execution)
- **g++**: C++ compiler (for C++ code execution)

## Troubleshooting

### Python not found
- Install Python 3 from [python.org](https://www.python.org/)
- Ensure `python3` is in your PATH

### g++ not found
- **macOS**: `xcode-select --install` or `brew install gcc`
- **Linux**: `sudo apt-get install build-essential`
- **Windows**: Install MinGW or use WSL

### Port 3000 already in use
- Change port: `PORT=3001 npm run dev`
- Or kill the process using port 3000

## Security Notes

The code execution system includes:
- Input validation and sanitization
- Timeout protection (10 seconds)
- Resource limits
- Dangerous pattern detection
- Sandboxed execution environment

Code execution runs in isolated temporary directories that are cleaned up after each execution.
