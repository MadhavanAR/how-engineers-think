# Stone Soup and Boiled Frogs

## Watching slow problems before they become big failures

Small changes rarely feel dangerous on their own.
The real risk is when many small compromises slowly become normal.

## The idea

Projects usually don’t fail suddenly.
They drift.

Each small shortcut, delay, or “temporary” decision feels harmless,
but over time the system becomes harder to maintain, slower to change,
and fragile.

Good engineers regularly step back and ask:
“Has this slowly become a problem?”

## Real-world scenario

A CI/CD pipeline originally takes 5 minutes to run.

Over months:
- a few extra tests are added
- another validation script is included
- one more environment check is introduced

Each change adds only seconds.
No one complains.

Eventually, the pipeline takes 45 minutes and blocks productivity.

## Where this appears in real projects

- Build pipelines that slowly become unusable
- Functions that grow condition-by-condition over time
- APIs that get slower with every small feature
- Systems that feel “heavy” without a clear breaking point