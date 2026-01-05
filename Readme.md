# How Engineers Think

**Real engineers sharing real thinking - not AI, not theory, just how we actually work.**

This is a collection of engineering principles, lessons, and insights from:
- **Companies** (Google, Meta, Amazon, etc.)
- **Senior Engineers** (mentors, tech leads, architects)
- **Books** (The Pragmatic Programmer, Clean Code, etc.)
- **Your Experience** (share what you've learned!)

Each lesson comes with working code examples you can run and experiment with. This is about **engineers thinking in their own right way** - contributing real-world wisdom from actual experience.

## What's This Made With?

- **Next.js** - A tool for building websites (like WordPress, but for modern apps)
- **TypeScript** - JavaScript with extra safety checks (like spell-check for code)
- **Python & C++** - Programming languages you can run directly in your browser
- **Vercel** - Free hosting that makes everything work online

## What Can You Do?

- 📚 Browse lessons about engineering thinking
- 💻 Edit and run Python code right in your browser
- 🔧 Run C++ code (it compiles automatically)
- ✏️ Change the code examples and see what happens
- 🎨 Clean, simple design that doesn't distract you
- ⚡ Everything loads fast and works smoothly

## Contributing

Want to add a lesson? Just create a folder in `sources/` with a `README.md` and optional code files. See [CONTRIBUTING.md](CONTRIBUTING.md) for step-by-step instructions.

## How to Get Started

### What You Need

- **Node.js** - Download it from [nodejs.org](https://nodejs.org/) (it's free, like downloading an app)
- That's it! Everything else is automatic.

### Step-by-Step Setup

1. **Install Node.js** (if you don't have it)
   - Go to [nodejs.org](https://nodejs.org/)
   - Download and install (just like installing any app)

2. **Open Terminal** (or Command Prompt on Windows)
   - On Mac: Press `Cmd + Space`, type "Terminal", press Enter
   - On Windows: Press `Win + R`, type "cmd", press Enter

3. **Navigate to this folder**
   ```bash
   cd /path/to/how-engineers-think
   ```
   (Replace `/path/to/` with where you saved this project)

4. **Install everything**
   ```bash
   npm install
   ```
   (This downloads all the tools needed - wait a minute or two)

5. **Start the website**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Go to [http://localhost:3000](http://localhost:3000)
   - You should see the website!

### Making It Live Online

If you want to put this on the internet (so anyone can use it):

1. Create a free account on [Vercel.com](https://vercel.com)
2. Connect your GitHub account
3. Click "Import Project" and select this repository
4. Click "Deploy" - that's it!

Vercel will automatically handle running the code (you don't need Python or C++ installed on your computer).

## How This Works (Simple Version)

Think of this website like a restaurant:

- **`/app`** - The dining room (what you see and interact with)
- **`/components`** - The furniture and decorations (reusable pieces)
- **`/lib`** - The kitchen (where the actual work happens)
- **`/types`** - The menu (defines what everything is)

### The Main Parts

1. **Code Runner** - When you click "Run", your code goes to a safe place (like a sandbox) and runs there. It can't break your computer.
2. **Safety Checks** - Before running your code, we check if it's safe (like checking if food is cooked before serving it).
3. **The Website** - All the buttons, pages, and pretty design you see.

### Running Code Online

When you deploy this to Vercel (free hosting), it automatically uses a service called "Piston API" to run your code. You don't need Python or C++ installed on your computer - everything runs in the cloud.

**Why?** Because Vercel's servers don't have Python or C++ installed by default. So we use Piston API (which is like a remote computer that can run code) to execute your programs safely.

### Want to Use Your Own Code Runner?

If you want to use a different service to run code, you can set an environment variable called `PISTON_API_URL` in your Vercel settings. But the default one works great!

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License.

**What this means:**
- ✅ You can use this project for **non-commercial purposes**
- ✅ You can **share** this project
- ❌ You **cannot** use this project for commercial purposes
- ❌ You **cannot** modify or create derivatives of this project

See the [LICENSE](LICENSE) file for full details.
