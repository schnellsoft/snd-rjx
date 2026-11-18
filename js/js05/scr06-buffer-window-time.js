/**
 * DEMO: bufferTime / windowTime with schedulers
 */
import {
  Subject,
  bufferTime,
  windowTime,
  mergeMap,
  toArray,
  asyncScheduler,
  take,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== bufferTime / windowTime ==========");

  // --- bufferTime(span, scheduler?) ---
  console.log("--- bufferTime(40) ---");
  const b$ = new Subject();
  b$.pipe(bufferTime(40, asyncScheduler)).subscribe((buf) =>
    console.log("bufferTime", buf),
  );
  b$.next(1);
  b$.next(2);
  // after ~40ms: [1,2]
  setTimeout(() => b$.complete(), 60);

  // --- bufferTime(span, creationInterval, maxSize?, scheduler?) ---
  console.log("--- bufferTime(50, 25) overlapping pattern (short) ---");
  const b2$ = new Subject();
  b2$
    .pipe(bufferTime(50, 25, 10, asyncScheduler), take(3))
    .subscribe((buf) => console.log("bufferTime-overlap", buf));
  b2$.next("a");
  setTimeout(() => b2$.next("b"), 10);
  setTimeout(() => b2$.complete(), 80);

  // --- windowTime ---
  console.log("--- windowTime(40) ---");
  const w$ = new Subject();
  w$
    .pipe(
      windowTime(40, asyncScheduler),
      mergeMap((win$) => win$.pipe(toArray())),
      take(2),
    )
    .subscribe((arr) => console.log("windowTime", arr));
  w$.next(10);
  w$.next(11);
  setTimeout(() => {
    w$.next(12);
    w$.complete();
  }, 50);
}

window.runDemo = runDemo;
runDemo();
