import {
  of,
  asapScheduler,
  asyncScheduler,
  observeOn,
  tap,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

/**
 * asapScheduler — microtask queue (Promise.then / queueMicrotask).
 * Runs AFTER the current stack, BEFORE macrotasks (setTimeout / asyncScheduler).
 */
export function runDemo() {
  console.log("--- asapScheduler ---");
  console.log("1. before subscribe");

  of("asap-A", "asap-B")
    .pipe(
      observeOn(asapScheduler),
      tap((v) => console.log("2. asap emitted:", v)),
    )
    .subscribe((v) => console.log("3. asap received:", v));

  of("async-X")
    .pipe(
      observeOn(asyncScheduler),
      tap((v) => console.log("4. async emitted:", v)),
    )
    .subscribe((v) => console.log("5. async received:", v));

  Promise.resolve().then(() => console.log("6. raw Promise microtask"));

  console.log("7. after subscribe (stack clear next → asap/Promise, then async)");

  // Expected order idea:
  // 1, 7, then asap (2/3), raw Promise (6), then async (4/5)
}

window.runDemo = runDemo;
runDemo();
