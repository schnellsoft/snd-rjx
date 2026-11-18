/**
 * DEMO: animationFrameScheduler with operators
 * observeOn, interval, scheduled work loop
 */
import {
  of,
  interval,
  take,
  observeOn,
  map,
  animationFrameScheduler,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== animationFrameScheduler cases ==========");

  // visual marker
  const box = document.createElement("div");
  box.style.cssText =
    "position:fixed;left:8px;top:8px;width:40px;height:40px;" +
    "background:#c4a35a;border-radius:6px;will-change:transform;";
  document.body.appendChild(box);

  // --- observeOn(animationFrameScheduler) ---
  console.log("--- observeOn(animationFrameScheduler) ---");
  of(0, 1, 2)
    .pipe(observeOn(animationFrameScheduler))
    .subscribe((n) => {
      box.style.transform = `translateX(${n * 30}px)`;
      console.log("rAF observeOn", n);
    });

  // --- interval(0, animationFrameScheduler) ---
  console.log("--- interval(0, animationFrameScheduler) take 20 ---");
  interval(0, animationFrameScheduler)
    .pipe(
      take(20),
      map((i) => i * 4),
    )
    .subscribe((x) => {
      box.style.transform = `translateX(${x}px)`;
      if (x % 20 === 0) console.log("rAF interval x=", x);
    });

  // --- manual recursive schedule (operator-adjacent pattern) ---
  let frame = 0;
  animationFrameScheduler.schedule(function tick(state) {
    state.frame += 1;
    if (state.frame <= 5) {
      console.log("manual rAF frame", state.frame);
      this.schedule(state);
    }
  }, 0, { frame });
}

window.runDemo = runDemo;
runDemo();
