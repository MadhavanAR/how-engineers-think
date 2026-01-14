# How Engineers Think

Learn engineering principles through interactive code examples. Each lesson includes working Python and C++ code you can run directly in your browser.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How It Works

**Zero Backend, Pure JSON** - Just like your friend's tech events project!

1. Add lessons in `sources/` folder (markdown + code files)
2. Build automatically generates `lessons.json`
3. Frontend loads JSON (one file, cached by browser)
4. Everything works client-side

**No database, no API, no backend needed.**

## Contributing

Add lessons by creating folders in `sources/`. See [CONTRIBUTING.md](CONTRIBUTING.md) for the simple format.

The system automatically:

- ✅ Generates JSON from your files
- ✅ Validates data structure
- ✅ Type-checks everything
- ✅ Works immediately after build

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Pyodide** - Python execution in browser
- **JSON** - Static data (no backend!)
- **Automated** - Build scripts handle everything

## License

CC BY-NC-ND 4.0
