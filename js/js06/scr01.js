/**
 * Animation demo with animationFrameScheduler
 *
 * WHY THIS IS SMOOTHER than interval / asyncScheduler (setTimeout):
 * ----------------------------------------------------------------
 * 1. SYNC WITH THE DISPLAY REFRESH
 *    animationFrameScheduler uses requestAnimationFrame (rAF).
 *    The browser fires rAF once per paint (typically ~60Hz / ~16.7ms,
 *    or matched to the screen refresh rate). Each DOM write happens
 *    just before the next paint, so motion lands on actual frames.
 *
 * 2. NO TIMER DRIFT / JITTER
 *    asyncScheduler uses setTimeout. Timers are clamped, compete with
 *    other macrotasks, and are NOT locked to vsync. Gaps like 14ms →
 *    22ms → 18ms produce uneven motion (stutter / judder).
 *
 * 3. ONE UPDATE PER FRAME
 *    rAF coalesces work to at most one callback per frame. A ~16ms
 *    setInterval can fire twice between paints (wasted work) or miss
 *    a paint entirely. Frame-aligned ticks avoid both.
 *
 * 4. BACKGROUND TAB BEHAVIOR
 *    Browsers pause or heavily throttle rAF in hidden tabs (saves CPU).
 *    setTimeout keeps waking more aggressively — worse for battery and
 *    can flood catch-up ticks when the tab becomes visible again.
 *
 * 5. TIME-BASED POSITION (not frame-count)
 *    We use elapsed ms from animationFrameScheduler.now() so speed stays
 *    stable even if a frame is dropped. Stepping by frame index would
 *    slow down when FPS drops; time-based easing does not.
 *
 * Contrast (do not use for UI motion):
 *   interval(16, asyncScheduler)  // ≈ setInterval — NOT vsync-locked
 */
import {
  Observable,
  animationFrameScheduler,
  map,
  takeWhile,
  finalize,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

/**
 * Cold Observable: emits { progress, eased } on every animation frame
 * until durationMs elapses, then completes. Teardown cancels the rAF.
 */
function createAnimation$(durationMs) {
  return new Observable((subscriber) => {
    const start = animationFrameScheduler.now();

    // schedule() on animationFrameScheduler ≈ requestAnimationFrame
    const task = animationFrameScheduler.schedule(function tick() {
      const elapsed = animationFrameScheduler.now() - start;
      const progress = Math.min(1, elapsed / durationMs);

      // easeInOutCubic — softer start/stop than linear translation
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - (-2 * progress + 2) ** 3 / 2;

      subscriber.next({ elapsed, progress, eased });

      if (progress < 1) {
        // `this` is the current scheduled action → queue next rAF
        this.schedule();
      } else {
        subscriber.complete();
      }
    });

    // Unsubscribe cancels the pending animation frame
    return () => task.unsubscribe();
  });
}

export function runDemo() {
  const label = document.createElement("p");
  label.style.cssText =
    "position:fixed;left:16px;top:16px;margin:0;z-index:2;" +
    "font:14px/1.4 system-ui,sans-serif;color:#b39f9f;";
  label.textContent =
    "animationFrameScheduler — synced to display refresh (smoother than setTimeout)";

  const ball = document.createElement("div");
  ball.style.cssText =
    "position:fixed;left:calc(50% - 140px);top:50%;" +
    "width:56px;height:56px;margin-top:-28px;border-radius:50%;" +
    "background:radial-gradient(circle at 30% 30%,#f0d78c,#c4a35a 55%,#8a7040);" +
    "box-shadow:0 8px 24px rgba(0,0,0,.35);" +
    "will-change:transform;"; // compositor layer → cheaper than animating left/top

  document.body.append(label, ball);

  const DISTANCE_PX = 280;
  const DURATION_MS = 2500;

  const sub = createAnimation$(DURATION_MS)
    .pipe(
      map(({ eased, progress }) => ({
        x: eased * DISTANCE_PX,
        progress,
      })),
      takeWhile(({ progress }) => progress < 1, true),
      finalize(() => {
        label.textContent += " — done";
        console.log("animation complete (rAF loop torn down)");
      }),
    )
    .subscribe({
      next: ({ x }) => {
        // transform is GPU-friendly; avoids layout thrash from left/top
        ball.style.transform = `translateX(${x}px)`;
      },
      error: (e) => console.error(e),
      complete: () => console.log("stream completed"),
    });

  // Console helper to cancel early
  window.stopAnimation = () => sub.unsubscribe();
  console.log("Animation started. Call stopAnimation() to cancel early.");
  return sub;
}

window.runDemo = runDemo;
runDemo();

