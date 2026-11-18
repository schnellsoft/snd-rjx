import { of, tap } from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

/**
 * "null" scheduler — no scheduler / synchronous delivery.
 * of(...values) with no scheduler argument emits synchronously inside subscribe.
 * Same idea as passing nothing (not queue, not async).
 */
export function runDemo() {
  console.log("--- null / sync (no scheduler) ---");
  console.log("1. before subscribe");

  // No observeOn, no scheduler argument → sync
  of(1, 2, 3)
    .pipe(tap((v) => console.log("2. emitted:", v)))
    .subscribe({
      next: (v) => console.log("3. received:", v),
      complete: () => console.log("4. done"),
    });

  console.log("5. after subscribe (runs AFTER all emissions — they were sync)");

  // Explicit: of can take a scheduler as last arg; omit it = sync
  // of(1, 2, 3, undefined) or simply of(1, 2, 3)
}

window.runDemo = runDemo;
runDemo();
