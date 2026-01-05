# How to Contribute

Share how engineers think at your company, from your mentor, or from your experience.

## Step 1: Create a Source

Create a folder in `sources/`:

```
sources/google-principles/
sources/senior-engineer-john/
sources/team-lead-insights/
sources/pragmatic-programmer/
```

**Naming:** Use kebab-case (lowercase-with-hyphens)

## Step 2: Add Source Info (Optional)

Create `SOURCE.md` in your source folder:

```markdown
source: Google Engineering Principles
```

Or:
```markdown
source: Senior Engineer at Meta
```

Or:
```markdown
source: Book: The Pragmatic Programmer
```

This shows where the principles come from!

## Step 3: Create a Lesson Folder

Inside your source, create a lesson folder:

```
sources/google-principles/01-code-review-culture/
```

**Naming:** Use numbers (01-, 02-, 03-) and kebab-case

## Step 4: Add README.md

Create `README.md` in your lesson folder:

```markdown
# Your Lesson Title

## Your Subtitle

One-line description here.

## The idea

Explain the concept in simple, beginner-friendly language.

## Real-world scenario

Describe a concrete example.

## Where you'll see this in real projects

- First example
- Second example
- Third example
- Fourth example
```

## Step 5: Add Code Examples (Optional)

```
sources/google-principles/01-code-review-culture/
├── README.md
├── python/
│   └── example.py      (optional)
└── cpp/
    └── example.cpp     (optional)
```

**You can add:** Only Python, only C++, or both.

## Step 6: Test It

1. Run `npm run dev`
2. Visit `http://localhost:3000`
3. Your source and lesson appear automatically!

## Example Structure

```
sources/
├── google-principles/
│   ├── SOURCE.md
│   └── 01-code-review-culture/
│       ├── README.md
│       ├── python/example.py
│       └── cpp/example.cpp
└── senior-engineer-john/
    ├── SOURCE.md
    └── 01-ownership-mindset/
        ├── README.md
        └── python/example.py
```

## That's It! 🎉

The system automatically:
- ✅ Reads your README.md
- ✅ Loads your code examples
- ✅ Shows the source (company, engineer, book, etc.)
- ✅ Creates shareable URLs: `/source/your-source` and `/lesson/lesson-name`
- ✅ Makes code runnable in the IDE

**No code changes needed!** Just add files and it works.

## What Can You Contribute?

- ✅ Engineering principles from your company
- ✅ Lessons from your mentor/senior engineer
- ✅ Team lead insights
- ✅ Book summaries with code examples
- ✅ Your own engineering wisdom

This is about **real engineers sharing real thinking** - not AI, not theory, just how we actually work.
