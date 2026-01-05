# Stone Soup and Boiled Frogs

## Watching slow problems before they become big failures

Small changes rarely feel dangerous on their own. The real risk is when many small compromises slowly become normal.

## The idea

You know that story about the frog? If you put a frog in boiling water, it jumps out. But if you put it in cold water and slowly heat it up, the frog doesn't notice until it's too late. The same thing happens with code! Projects usually don't fail suddenly. They drift. Each small shortcut, delay, or "temporary" decision feels harmless, but over time the system becomes harder to maintain, slower to change, and fragile. Good engineers regularly step back and ask: "Has this slowly become a problem?" They catch things before they get too bad, just like checking if the water is getting too hot.

## Real-world scenario

Imagine you're building a website, and every time you make a change, the computer checks if everything still works. At first, this check takes 5 minutes - totally fine, you can grab a snack. But then someone adds a few more checks. Then someone else adds a few more. Each addition only adds a few seconds, so nobody thinks it's a big deal. But after a few months, that 5-minute check has become 45 minutes! Now you can't make changes quickly anymore, and everyone is frustrated. This is how small, harmless changes add up to a big problem. The fix? Regularly check how long things take, and if something is getting slower, fix it before it becomes a huge problem.

## Where you'll see this in real projects

- Websites that get slower and slower as more features are added (like a backpack that gets heavier each day until you can't carry it)
- Code that works but becomes harder to understand over time (like a room that gets messier each day until you can't find anything)
- Programs that take longer and longer to start up (like a computer that gets slower each time you install something)
- Systems that feel "heavy" without a clear breaking point (like a car that gets noisier each month until one day it won't start)