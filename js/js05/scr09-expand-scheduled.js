/**
 * DEMO: expand with concurrent + scheduler
 */
import {
  of,
  expand,
  take,
  asyncScheduler,
  queueScheduler,
  map,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== expand + scheduler ==========");

  // --- expand without scheduler (default) ---
  console.log("--- expand take(4) ---");
  of(1)
    .pipe(
      expand((x) => of(x + 1)),
      take(4),
    )
    .subscribe((v) => console.log("expand", v));

  // --- expand(..., concurrent, scheduler) ---
  console.log("--- expand(..., 1, asyncScheduler) ---");
  console.log("before expand-async");
  of(1)
    .pipe(
      expand((x) => of(x + 1), 1, asyncScheduler),
      take(4),
    )
    .subscribe((v) => console.log("expand-async", v));
  console.log("after expand-async subscribe");

  // --- expand with queueScheduler ---
  console.log("--- expand(..., 1, queueScheduler) ---");
  of(10)
    .pipe(
      expand((x) => of(x + 10), 1, queueScheduler),
      take(3),
    )
    .subscribe((v) => console.log("expand-queue", v));
}

window.runDemo = runDemo;
runDemo();
