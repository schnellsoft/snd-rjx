/**
 * RxJS operators demo — WINDOWING
 * window, windowCount, windowTime, windowToggle, windowWhen
 * Windows emit Observables of values (higher-order) instead of arrays.
 */
import {
  of,
  window,
  windowCount,
  windowTime,
  windowToggle,
  windowWhen,
  mergeAll,
  toArray,
  mergeMap,
  Subject,
  timer,
  tap,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== WINDOWING OPERATORS ==========");

  // --- windowCount: every N values → inner Observable ---
  console.log("--- windowCount ---");
  of(1, 2, 3, 4)
    .pipe(
      windowCount(2),
      // flatten each window into an array for readable logs
      mergeMap((win$) => win$.pipe(toArray())),
    )
    .subscribe((v) => console.log("windowCount:", v));

  // --- window: close/reopen when notifier emits ---
  console.log("--- window(notifier) ---");
  const src$ = new Subject();
  const boundary$ = new Subject();
  src$
    .pipe(
      window(boundary$),
      mergeMap((win$) => win$.pipe(toArray())),
    )
    .subscribe((v) => console.log("window:", v));
  src$.next(1);
  src$.next(2);
  boundary$.next(); // closes first window → [1,2]
  src$.next(3);
  boundary$.next();

  // --- windowWhen: closing factory ---
  console.log("--- windowWhen ---");
  const w$ = new Subject();
  w$
    .pipe(
      windowWhen(() => timer(15)),
      mergeMap((win$) => win$.pipe(toArray())),
    )
    .subscribe((v) => console.log("windowWhen:", v));
  w$.next("x");
  w$.next("y");

  // --- windowToggle ---
  console.log("--- windowToggle ---");
  const vals$ = new Subject();
  const openings$ = new Subject();
  vals$
    .pipe(
      windowToggle(openings$, () => timer(15)),
      mergeMap((win$) => win$.pipe(toArray())),
    )
    .subscribe((v) => console.log("windowToggle:", v));
  openings$.next();
  vals$.next(10);
  vals$.next(11);

  // --- windowTime: time-based windows (pattern) ---
  console.log("--- windowTime pattern: source$.pipe(windowTime(1000), mergeAll()) ---");
}

window.runDemo = runDemo;
runDemo();
