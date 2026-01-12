# Frontend-Only Architecture - Complete Setup Guide

## Overview

This application now works **completely independently in the frontend** without requiring any backend services. All user data, progress tracking, and code execution happens entirely in the browser.

## ✅ What's Been Implemented

### 1. **Frontend Data Service** (`lib/services/frontend-data.ts`)

- Loads all lessons and sources from static JSON file
- No API calls needed for data access
- Automatic fallback to hardcoded data if JSON unavailable

### 2. **Client-Side Code Execution** (`lib/services/client-code-executor.ts`)

- **Python**: Full execution using Pyodide (WebAssembly-based Python runtime)
- **C++**: Syntax checking and compilation validation
- All execution happens in the browser - no server needed

### 3. **IndexedDB Storage Layer** (`lib/storage/indexed-db.ts`)

- Robust client-side storage for user data
- Better performance than localStorage
- Automatic migration from localStorage

### 4. **Updated Hooks & Components**

- `useSources` - Uses frontend data service
- `useLessons` - Uses frontend data service
- `useCodeExecution` - Uses client-side executor
- All pages updated to use frontend services

### 5. **Build-Time Data Generation**

- Script generates `public/data/lessons.json` from sources directory
- Runs automatically before build (`prebuild` script)

## 🚀 How It Works

### Data Flow

```
Build Time:
  sources/ → generate-lessons-json.js → public/data/lessons.json

Runtime:
  Browser → Load lessons.json → Cache in memory → Use everywhere
```

### User Progress

```
User Action → IndexedDB/localStorage → Persists across sessions
```

### Code Execution

```
User Code → Client Executor → Pyodide (Python) / WASM (C++) → Results
```

## 📦 Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Data File

The data file is automatically generated before build, but you can generate it manually:

```bash
node scripts/generate-lessons-json.js
```

This creates `public/data/lessons.json` with all lessons.

### 3. Build

```bash
npm run build
```

The `prebuild` script automatically generates the data file.

### 4. Deploy

Deploy as a static site - no server needed!

- **Vercel**: `vercel --prod`
- **Netlify**: Connect GitHub repo
- **GitHub Pages**: Enable in repo settings
- **Any CDN**: Upload `out/` directory

## 🔧 Architecture Details

### Frontend Data Service

```typescript
import { getAllSources, getLessonById } from '@/lib/services/frontend-data';

// Get all sources
const sources = await getAllSources();

// Get specific lesson
const lesson = await getLessonById('lesson-id');
```

### Code Execution

```typescript
import { executeCode, compileCpp } from '@/lib/services/client-code-executor';

// Execute Python
const result = await executeCode(code, 'python');

// Compile C++
const result = await compileCpp(code);
```

### Storage

```typescript
import { put, get, getAll } from '@/lib/storage/indexed-db';

// Store progress
await put('progress', progressData);

// Get progress
const progress = await get('progress', 'user-progress');
```

## 🎯 Benefits

1. **No Backend Required** - Entire app runs in browser
2. **Offline Support** - Works without internet after initial load
3. **Privacy** - All data stays in user's browser
4. **Performance** - No network latency for data access
5. **Scalability** - No server load concerns
6. **Cost Effective** - No server infrastructure needed

## 📝 Migration Notes

### From Backend API to Frontend Service

**Before:**

```typescript
const response = await fetch('/api/sources');
const data = await response.json();
```

**After:**

```typescript
import { getAllSources } from '@/lib/services/frontend-data';
const data = await getAllSources();
```

### Code Execution

**Before:**

```typescript
const response = await fetch('/api/execute', {
  method: 'POST',
  body: JSON.stringify({ code, language }),
});
```

**After:**

```typescript
import { executeCode } from '@/lib/services/client-code-executor';
const result = await executeCode(code, language);
```

## 🔍 Testing

All services can be tested independently:

```typescript
// Test data loading
import { getAllSources } from '@/lib/services/frontend-data';
const sources = await getAllSources();
expect(sources.length).toBeGreaterThan(0);

// Test code execution
import { executePython } from '@/lib/services/client-code-executor';
const result = await executePython('print("Hello")');
expect(result.success).toBe(true);
```

## 🚨 Important Notes

### Python Execution

- Pyodide loads from CDN on first use (~10MB download)
- First execution may be slow due to initialization
- Subsequent executions are fast

### C++ Execution

- Currently provides syntax checking only
- Full execution requires WebAssembly compilation
- Can be enhanced with Emscripten or similar tools

### Data File

- Generated at build time from `sources/` directory
- Must be regenerated when lessons are added/updated
- Automatically included in build output

## 🎓 FAANG-Level Architecture Principles

1. **Separation of Concerns**: Data, execution, and storage are separate services
2. **Lazy Loading**: Pyodide loads only when needed
3. **Caching**: Data cached in memory after first load
4. **Error Handling**: Graceful fallbacks at every layer
5. **Type Safety**: Full TypeScript support
6. **Performance**: Optimized for fast initial load
7. **Scalability**: Can handle unlimited users (no server load)

## 📚 Next Steps

1. **Service Worker**: Add offline caching for better performance
2. **Full C++ Execution**: Implement WebAssembly-based C++ runtime
3. **Data Sync**: Optional cloud sync for multi-device access
4. **PWA**: Make installable as Progressive Web App

## 🐛 Troubleshooting

### Data not loading?

- Check if `public/data/lessons.json` exists
- Run `node scripts/generate-lessons-json.js` manually
- Check browser console for errors

### Python execution not working?

- Check if Pyodide CDN is accessible
- First load may take time (downloading ~10MB)
- Check browser console for errors

### Build fails?

- Ensure `sources/` directory exists
- Check Node.js version (requires Node 18+)
- Run `npm install` to ensure dependencies are installed

## 📞 Support

For issues or questions, check:

- `docs/FRONTEND_ARCHITECTURE.md` - Detailed architecture docs
- `lib/services/` - Service implementations
- `scripts/generate-lessons-json.js` - Data generation script
