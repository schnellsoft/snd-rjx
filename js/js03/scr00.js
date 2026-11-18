import {
  of,
  asyncScheduler,
  observeOn,
  tap,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

/**
 * asyncScheduler — schedules via setTimeout (macrotask).
 * Work runs AFTER the current call stack and AFTER microtasks (Promise/asap).
 */
export function runDemo() {
  console.log("--- asyncScheduler ---");
  console.log("1. before subscribe");

  of(1, 2, 3)
    .pipe(
      observeOn(asyncScheduler), // each emission deferred with setTimeout(0)-style
      tap((v) => console.log("2. emitted:", v)),
    )
    .subscribe({
      next: (v) => console.log("3. received:", v),
      complete: () => console.log("4. done"),
    });

  console.log("5. after subscribe (runs BEFORE any emission)");

  // Direct one-off schedule (like setTimeout)
  const handle = asyncScheduler.schedule(
    (label) => console.log("6. scheduled task:", label),
    300,
    "hello from asyncScheduler.schedule",
  );

  return { handle };
}

window.runDemo = runDemo;
runDemo();
