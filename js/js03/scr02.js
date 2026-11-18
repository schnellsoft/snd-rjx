import {
  of,
  queueScheduler,
  observeOn,
  tap,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

/**
 * queueScheduler — runs work on a queue, but still in the CURRENT turn
 * (synchronously drained). Useful to avoid re-entrancy / stack growth,
 * not to defer to a later macrotask.
 */
export function runDemo() {
  console.log("--- queueScheduler ---");
  console.log("1. before subscribe");

  of(1, 2, 3)
    .pipe(
      observeOn(queueScheduler),
      tap((v) => console.log("2. emitted:", v)),
    )
    .subscribe({
      next: (v) => console.log("3. received:", v),
      complete: () => console.log("4. done"),
    });

  // With queueScheduler, emissions are queued then flushed before leaving subscribe,
  // so you still typically see 2/3/4 before line 5 — but nested schedules go to the queue.
  console.log("5. after subscribe");

  console.log("6. nesting demo:");
  queueScheduler.schedule(() => {
    console.log("   outer queue job");
    queueScheduler.schedule(() => console.log("   inner queue job (after outer finishes)"));
    console.log("   outer still running");
  });
  console.log("7. after nesting schedule (queue already flushed)");
}

window.runDemo = runDemo;
runDemo();
