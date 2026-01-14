# Contributing

Add lessons by creating folders in `sources/`. The system automatically picks them up.

## Structure

```
sources/
└── your-source-name/
    ├── SOURCE.md          (optional - shows attribution)
    └── 01-lesson-name/
        ├── README.md      (required)
        ├── python/
        │   └── example.py (optional)
        └── cpp/
            └── example.cpp (optional)
```

## README.md Format

```markdown
# Lesson Title

## Subtitle

One-line description.

## The idea

Explain the concept simply.

## Real-world scenario

Give a concrete example.

## Where you'll see this in real projects

- Example 1
- Example 2
- Example 3
- Example 4
```

## Naming

- Source folders: `kebab-case`
- Lesson folders: `01-`, `02-`, `03-` prefix with kebab-case

## Testing

Run `npm run dev` and your lesson appears automatically at `http://localhost:3000`.

No code changes needed - just add files!
