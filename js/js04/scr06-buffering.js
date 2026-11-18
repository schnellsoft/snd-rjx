/**
 * RxJS operators demo — BUFFERING
 * buffer, bufferCount, bufferTime, bufferToggle, bufferWhen
 */
import {
  of,
  interval,
  buffer,
  bufferCount,
  bufferTime,
  bufferToggle,
  bufferWhen,
  take,
  Subject,
  timer,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== BUFFERING OPERATORS ==========");

  // --- bufferCount: arrays of N values ---
  console.log("--- bufferCount ---");
  of(1, 2, 3, 4, 5)
    .pipe(bufferCount(2))
    .subscribe((v) => console.log("bufferCount(2):", v));
  // [1,2], [3,4], [5] on complete depending on version/settings

  // overlapping windows: bufferCount(n, startEvery)
  of(1, 2, 3, 4)
    .pipe(bufferCount(3, 1))
    .subscribe((v) => console.log("bufferCount(3,1):", v));

  // --- buffer: collect until notifier emits ---
  console.log("--- buffer(notifier) ---");
  const src$ = new Subject();
  const close$ = new Subject();
  src$.pipe(buffer(close$)).subscribe((v) => console.log("buffer:", v));
  src$.next(1);
  src$.next(2);
  close$.next(); // emits [1,2]
  src$.next(3);
  close$.next(); // emits [3]

  // --- bufferTime: emit arrays every ms (uses async scheduler) ---
  console.log("--- bufferTime (short demo via Subject+timer style skipped if noisy) ---");
  // Pattern: source$.pipe(bufferTime(1000))

  // --- bufferWhen: open buffer; closing Observable factory each time ---
  console.log("--- bufferWhen ---");
  const bw$ = new Subject();
  bw$
    .pipe(bufferWhen(() => timer(20)))
    .subscribe((v) => console.log("bufferWhen:", v));
  bw$.next("a");
  bw$.next("b");

  // --- bufferToggle: openings emit; each maps to a closing Observable ---
  console.log("--- bufferToggle ---");
  const values$ = new Subject();
  const openings$ = new Subject();
  values$
    .pipe(bufferToggle(openings$, () => timer(15)))
    .subscribe((v) => console.log("bufferToggle:", v));
  openings$.next(); // open a buffer
  values$.next(1);
  values$.next(2);
  // closes after 15ms → [1,2]
}

window.runDemo = runDemo;
runDemo();
