/**
 * DEMO: interval / timer with different schedulers
 */
import {
  interval,
  timer,
  take,
  asyncScheduler,
  animationFrameScheduler,
  asapScheduler,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== interval / timer + scheduler ==========");

  // --- interval default = asyncScheduler ---
  console.log("--- interval(0).pipe(take(2)) default async ---");
  interval(0)
    .pipe(take(2))
    .subscribe((n) => console.log("interval-async", n));

  // --- interval on animationFrameScheduler ---
  console.log("--- interval(0, animationFrameScheduler).pipe(take(3)) ---");
  interval(0, animationFrameScheduler)
    .pipe(take(3))
    .subscribe((n) =>
      console.log("interval-rAF", n, "t=", performance.now().toFixed(0)),
    );

  // --- timer one-shot ---
  console.log("--- timer(30) ---");
  timer(30).subscribe((n) => console.log("timer-oneshot", n));

  // --- timer with period ---
  console.log("--- timer(20, 20).pipe(take(2)) ---");
  timer(20, 20)
    .pipe(take(2))
    .subscribe((n) => console.log("timer-period", n));

  // --- timer with explicit scheduler ---
  console.log("--- timer(0, asapScheduler) ---");
  timer(0, asapScheduler).subscribe((n) => console.log("timer-asap", n));
}

window.runDemo = runDemo;
runDemo();
