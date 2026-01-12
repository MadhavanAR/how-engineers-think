# Frontend-Only Architecture

This document describes the frontend-only architecture that makes the application completely independent of backend services.

## Overview

The application is designed to work entirely in the browser, with all data and functionality running client-side. This provides:

- **Offline Support**: Works without internet connection after initial load
- **Privacy**: All user data stays in the browser
- **Performance**: No server round-trips for data access
- **Scalability**: No backend infrastructure needed
- **Cost**: No server costs for data serving

## Architecture Components

### 1. Frontend Data Service (`lib/services/frontend-data.ts`)

**Purpose**: Provides all lesson and source data directly to the frontend without API calls.

**How it works**:

- Loads data from static JSON file (`/data/lessons.json`) generated at build time
- Falls back to hardcoded data if JSON file is unavailable
- Caches data in memory for fast access

**Usage**:

```typescript
import { getAllSources, getLessonById } from '@/lib/services/frontend-data';

const sources = await getAllSources();
const lesson = await getLessonById('lesson-id');
```

### 2. Client-Side Code Execution (`lib/services/client-code-executor.ts`)

**Purpose**: Executes Python and C++ code entirely in the browser.

**Python Execution**:

- Uses Pyodide (Python runtime compiled to WebAssembly)
- Loads from CDN on first use
- Captures stdout/stderr for output display

**C++ Execution**:

- Currently provides syntax checking
- Full execution requires WebAssembly compilation (can be enhanced)

**Usage**:

```typescript
import { executeCode } from '@/lib/services/client-code-executor';

const result = await executeCode(code, 'python');
// or
const result = await executeCode(code, 'cpp', 'compile');
```

### 3. IndexedDB Storage Layer (`lib/storage/indexed-db.ts`)

**Purpose**: Provides robust client-side storage with better performance than localStorage.

**Features**:

- Structured data storage
- Better quota management
- Transaction support
- Automatic migration from localStorage

**Usage**:

```typescript
import { put, get, getAll } from '@/lib/storage/indexed-db';

await put('progress', progressData);
const progress = await get('progress', 'user-progress');
const allBookmarks = await getAll('bookmarks');
```

### 4. Data Generation Script (`scripts/generate-lessons-json.js`)

**Purpose**: Generates static JSON file from sources directory at build time.

**How it works**:

- Runs before Next.js build (`prebuild` script)
- Reads all lessons from `sources/` directory
- Generates `public/data/lessons.json`
- Frontend loads this file on initialization

## Data Flow

### Initial Load

1. User visits the site
2. Frontend loads `lessons.json` from `/data/lessons.json`
3. Data is cached in memory
4. All subsequent requests use cached data

### User Progress

1. User actions (completing lessons, bookmarks) stored in IndexedDB
2. Data persists across sessions
3. No server synchronization needed

### Code Execution

1. User writes code in editor
2. Code sent to client-side executor
3. Python: Executed via Pyodide
4. C++: Syntax checked (full execution can be added)
5. Results displayed immediately

## Storage Strategy

### IndexedDB (Primary)

- User progress
- Bookmarks
- Preferences
- Large datasets

### localStorage (Fallback)

- Used if IndexedDB unavailable
- Automatic migration to IndexedDB on first load

## Build Process

1. **Pre-build**: `generate-lessons-json.js` creates static data file
2. **Build**: Next.js bundles application
3. **Deploy**: Static files served (no server needed for data)

## Migration from Backend

The application has been migrated from backend API calls to frontend services:

### Before (Backend)

```typescript
const response = await fetch('/api/sources');
const data = await response.json();
```

### After (Frontend)

```typescript
import { getAllSources } from '@/lib/services/frontend-data';
const data = await getAllSources();
```

## Benefits

1. **No Backend Required**: Entire app runs in browser
2. **Offline First**: Works without internet after initial load
3. **Fast**: No network latency for data access
4. **Private**: All data stays in user's browser
5. **Scalable**: No server load concerns
6. **Cost Effective**: No server infrastructure needed

## Future Enhancements

1. **Full C++ Execution**: Implement WebAssembly-based C++ runtime
2. **Service Worker**: Add offline caching for better performance
3. **Data Sync**: Optional cloud sync for multi-device access
4. **Progressive Web App**: Make installable as PWA

## Testing

All frontend services can be tested independently:

```typescript
// Test data service
import { getAllSources } from '@/lib/services/frontend-data';
const sources = await getAllSources();
expect(sources.length).toBeGreaterThan(0);

// Test code execution
import { executePython } from '@/lib/services/client-code-executor';
const result = await executePython('print("Hello")');
expect(result.success).toBe(true);
```

## Deployment

The application can be deployed as a static site:

- **Vercel**: Automatic static export
- **Netlify**: Static site hosting
- **GitHub Pages**: Free static hosting
- **Any CDN**: Just serve static files

No server-side rendering or API routes needed for core functionality.
