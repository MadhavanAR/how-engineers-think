# How Engineers Think

A personal collection of real-world engineering lessons, explained with small, practical code examples.

This repository documents how I'm learning to think, decide and take responsibility as an engineer.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Clean Architecture** - Separation of concerns, SDE principles
- **Secure Code Execution** - Sandboxed Python and C++ execution

## Features

- 🎓 Interactive lesson browser
- 💻 Run Python code directly in the browser
- 🔧 Execute C++ code with compilation
- 🔒 Security-first code execution with validation
- 🎨 Modern, minimal UI design
- ⚡ Fast and responsive

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.x (for Python code execution)
- g++ compiler (for C++ code execution)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Architecture

The project follows clean code and SDE principles:

- **`/app`** - Next.js App Router (pages, API routes, layouts)
- **`/components`** - Reusable React components
- **`/lib`** - Business logic (code execution, validation, security)
- **`/types`** - TypeScript type definitions

### Key Components

- **Code Executor** - Secure, sandboxed code execution with timeouts
- **Security Layer** - Input validation and dangerous pattern detection
- **API Routes** - RESTful endpoints for code execution and lesson data
- **UI Components** - Modular, reusable React components

### How It Works

This is a **server-side code execution IDE** that allows users to edit and run code safely. See [ARCHITECTURE.md](./ARCHITECTURE.md) for a detailed explanation of:

- How user code modifications are handled
- Security layers and validation
- Frontend-backend communication flow
- Current limitations and future enhancements

## License

Copyright (c) 2026 MadhavanAR. All Rights Reserved.

This work is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this work is strictly prohibited without express written permission.
