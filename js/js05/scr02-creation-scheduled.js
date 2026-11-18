/**
 * DEMO: creation operators with an explicit scheduler
 * of, range, from/scheduled, generate, throwError
 */
import {
  of,
  range,
  from,
  scheduled,
  generate,
  throwError,
  asyncScheduler,
  asapScheduler,
  queueScheduler,
  take,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== creation + scheduler ==========");

  // --- of(..., scheduler) ---
  console.log("--- of + asyncScheduler ---");
  console.log("before of-async");
  of(1, 2, asyncScheduler).subscribe((v) => console.log("of-async", v));
  console.log("after of-async");

  // --- range(..., scheduler) ---
  console.log("--- range + queueScheduler ---");
  range(10, 3, queueScheduler).subscribe((v) => console.log("range-queue", v));

  console.log("--- range + asyncScheduler ---");
  console.log("before range-async");
  range(1, 2, asyncScheduler).subscribe((v) => console.log("range-async", v));
  console.log("after range-async");

  // --- scheduled(iterable, scheduler) preferred over from(..., scheduler) ---
  console.log("--- scheduled + asapScheduler ---");
  console.log("before scheduled-asap");
  scheduled(["a", "b"], asapScheduler).subscribe((v) =>
    console.log("scheduled-asap", v),
  );
  console.log("after scheduled-asap");

  // --- generate with scheduler ---
  console.log("--- generate + asyncScheduler ---");
  generate({
    initialState: 0,
    condition: (x) => x < 3,
    iterate: (x) => x + 1,
    resultSelector: (x) => x,
    scheduler: asyncScheduler,
  }).subscribe((v) => console.log("generate-async", v));

  // --- throwError(..., scheduler) schedules the error notification ---
  console.log("--- throwError + asyncScheduler ---");
  console.log("before throwError");
  throwError(() => new Error("boom"), asyncScheduler).subscribe({
    error: (e) => console.log("throwError-async", e.message),
  });
  console.log("after throwError (error still pending)");
}

window.runDemo = runDemo;
runDemo();
