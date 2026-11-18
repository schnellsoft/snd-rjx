/**
 * DEMO: buffer / window families whose closings use timer/interval (scheduler clock)
 * buffer, bufferToggle, bufferWhen, window, windowToggle, windowWhen
 */
import {
  Subject,
  buffer,
  bufferToggle,
  bufferWhen,
  window,
  windowToggle,
  windowWhen,
  timer,
  mergeMap,
  toArray,
  asyncScheduler,
  animationFrameScheduler,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== buffer/window + timer closings ==========");

  // --- buffer(notifier) ---
  console.log("--- buffer(timer) ---");
  const src$ = new Subject();
  src$
    .pipe(buffer(timer(30, asyncScheduler)))
    .subscribe((v) => console.log("buffer+timer", v));
  src$.next(1);
  src$.next(2);

  // --- bufferWhen(() => timer(...)) ---
  console.log("--- bufferWhen(() => timer(25)) ---");
  const bw$ = new Subject();
  bw$
    .pipe(bufferWhen(() => timer(25, asyncScheduler)))
    .subscribe((v) => console.log("bufferWhen", v));
  bw$.next("a");
  bw$.next("b");

  // --- bufferToggle(openings, () => timer(...)) ---
  console.log("--- bufferToggle ---");
  const vals$ = new Subject();
  const openings$ = new Subject();
  vals$
    .pipe(bufferToggle(openings$, () => timer(20, asyncScheduler)))
    .subscribe((v) => console.log("bufferToggle", v));
  openings$.next();
  vals$.next(10);
  vals$.next(11);

  // --- windowWhen + toArray ---
  console.log("--- windowWhen ---");
  const w$ = new Subject();
  w$
    .pipe(
      windowWhen(() => timer(25, asyncScheduler)),
      mergeMap((win$) => win$.pipe(toArray())),
    )
    .subscribe((v) => console.log("windowWhen", v));
  w$.next("x");
  w$.next("y");

  // --- windowToggle with rAF-based close (due 0 on animationFrame) ---
  console.log("--- windowToggle + timer(0, animationFrameScheduler) ---");
  const v2$ = new Subject();
  const open2$ = new Subject();
  v2$
    .pipe(
      windowToggle(open2$, () => timer(0, animationFrameScheduler)),
      mergeMap((win$) => win$.pipe(toArray())),
    )
    .subscribe((v) => console.log("windowToggle-rAF", v));
  open2$.next();
  v2$.next("f1");
}

window.runDemo = runDemo;
runDemo();
