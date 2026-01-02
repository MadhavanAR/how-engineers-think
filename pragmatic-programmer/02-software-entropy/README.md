## Software Entropy — Broken Windows

### The idea
Small neglected issues signal that no one cares.
Once that signal exists, code quality decays rapidly.

Professional engineers fix small problems early,
or temporarily "board them up" to prevent further damage.

---

### Real-world scenario
An unused function causes warnings in logs.
It’s not part of today’s task, so it gets ignored.

Soon:
- warnings pile up
- real errors are missed
- the codebase feels abandoned

---

### Where this shows up in real systems
- CI/CD pipelines with ignored warnings
- deprecated API endpoints left running forever
- outdated README files
- feature flags that never get removed

### Expected Output
The program runs without warnings or failures,
showing how handling small issues early
prevents long-term code decay.

Small messes compound into big failures.

Source: The Pragmatic Programmer 