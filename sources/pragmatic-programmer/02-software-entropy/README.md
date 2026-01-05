# Software Entropy

## Broken Windows

Small problems left unfixed become big problems. Fix them early, or at least put a temporary fix in place.

## The idea

You know that broken window theory? If a building has one broken window that nobody fixes, people think "nobody cares about this place." So they break more windows, spray graffiti, and trash piles up. The same thing happens with code! If you leave small problems unfixed (like error messages that pop up all the time, or code that's kinda broken), other programmers think "nobody cares about this code." So they stop being careful, add more broken stuff, and everything gets worse. Good engineers fix small problems right away. If they can't fix it completely, they at least put a temporary fix (like boarding up that broken window) so it stops causing more problems.

## Real-world scenario

You have some old code that you're not using anymore, but every time you run your program, it shows a warning message. It's annoying but not breaking anything, so you ignore it. A week later, you have 50 warning messages. Now when something actually breaks, you can't tell which warnings matter and which ones are just noise. Your code feels messy and broken, even though it still works. This is how one small ignored problem turns into a huge mess. The fix? Deal with that first warning immediately. Even if you can't fix it properly, at least make it stop showing up so you can see real problems when they happen.

## Where you'll see this in real projects

- Warning messages that keep popping up but nobody fixes them (like that annoying "check engine" light in your car)
- Old website buttons that don't work anymore but are still there (like a "Share on MySpace" button)
- Instructions that are wrong because the website changed (like a tutorial that says "click the blue button" but it's now red)
- Test code that was left in the final product (like leaving sticky notes in your finished homework)
