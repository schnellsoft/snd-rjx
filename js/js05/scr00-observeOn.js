/**
 * DEMO: observeOn(scheduler) — deliver notifications on a chosen scheduler.
 * Does NOT delay subscription; only next/error/complete delivery.
 */
import {
  of,
  observeOn,
  tap,
  asyncScheduler,
  asapScheduler,
  queueScheduler,
  animationFrameScheduler,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== observeOn ==========");

  // --- asyncScheduler (macrotask) ---
  console.log("--- observeOn(asyncScheduler) ---");
  console.log("1 before");
  of("A")
    .pipe(
      tap(() => console.log("2 source emit (sync)")),
      observeOn(asyncScheduler),
      tap(() => console.log("3 after observeOn")),
    )
    .subscribe((v) => console.log("4 recv", v));
  console.log("5 after subscribe");

  // --- asapScheduler (microtask) ---
  console.log("--- observeOn(asapScheduler) ---");
  console.log("a before");
  of("B")
    .pipe(observeOn(asapScheduler))
    .subscribe((v) => console.log("c asap", v));
  console.log("b after");

  // --- queueScheduler (same turn queue) ---
  console.log("--- observeOn(queueScheduler) ---");
  of("C")
    .pipe(observeOn(queueScheduler))
    .subscribe((v) => console.log("queue", v));
  console.log("after queue observeOn subscribe");

  // --- animationFrameScheduler ---
  console.log("--- observeOn(animationFrameScheduler) ---");
  of("frame")
    .pipe(observeOn(animationFrameScheduler))
    .subscribe((v) => console.log("rAF", v, performance.now().toFixed(0)));

  // --- optional delay argument ---
  of("delayed")
    .pipe(observeOn(asyncScheduler, 50))
    .subscribe((v) => console.log("observeOn+delay", v));
}

window.runDemo = runDemo;
runDemo();
