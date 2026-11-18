import { animationFrameScheduler } from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

/**
 * animationFrameScheduler — aligns work with requestAnimationFrame.
 * Ideal for visual updates (~60fps), not for general async I/O.
 */
export function runDemo() {
  console.log("--- animationFrameScheduler ---");

  const box = document.createElement("div");
  box.textContent = "anim";
  box.style.cssText =
    "position:fixed;left:0;top:40px;width:48px;height:48px;" +
    "background:#c4a35a;color:#222;display:grid;place-items:center;" +
    "font:12px sans-serif;border-radius:6px;will-change:transform;";
  document.body.appendChild(box);

  console.log("1. scheduling frames via animationFrameScheduler");

  // schedule recursively — classic rAF loop pattern
  let frame = 0;
  const maxFrames = 60; // ~1s at 60fps

  const handle = animationFrameScheduler.schedule(function tick(state) {
    const x = (state.frame / maxFrames) * 200;
    box.style.transform = `translateX(${x}px)`;
    console.log("2. frame", state.frame, "t=", performance.now().toFixed(0));

    state.frame += 1;
    if (state.frame < maxFrames) {
      // reschedule on next animation frame
      this.schedule(state);
    } else {
      console.log("3. animation done");
      box.textContent = "done";
    }
  }, 0, { frame });

  // Alternative: interval coordinated with observeOn(animationFrameScheduler)
  // interval(0, animationFrameScheduler).pipe(take(60), ...)

  return { handle, box };
}

window.runDemo = runDemo;
runDemo();
