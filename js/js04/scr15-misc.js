/**
 * RxJS operators demo — MISC / REMAINING COMMON OPERATORS
 * audit, throttle, sample (notifier forms), repeat, repeatWhen,
 * single, skipUntil already in filter, connectable connect,
 * switchScan, refCount already shown, finalize already shown
 */
import {
  of,
  Subject,
  repeat,
  single,
  switchScan,
  delay,
  map,
  audit,
  throttle,
  timer,
  catchError,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== MISC OPERATORS ==========");

  // --- repeat: resubscribe to source N times after complete ---
  console.log("--- repeat ---");
  of("tick")
    .pipe(repeat(2))
    .subscribe((v) => console.log("repeat:", v)); // tick, tick

  // --- single: expect exactly one matching value (or one value) ---
  console.log("--- single ---");
  of(1, 2, 3)
    .pipe(
      single((n) => n === 2),
      catchError((e) => of("single error: " + e.name)),
    )
    .subscribe((v) => console.log("single:", v));

  of(42)
    .pipe(single())
    .subscribe((v) => console.log("single one value:", v));

  // --- switchScan: scan whose accumulator projector returns Observable; switches ---
  console.log("--- switchScan ---");
  of(1, 2, 3)
    .pipe(switchScan((acc, v) => of(acc + v).pipe(delay(5)), 0))
    .subscribe((v) => console.log("switchScan:", v));

  // --- audit / throttle with notifier factories ---
  console.log("--- audit / throttle (notifier) ---");
  const a$ = new Subject();
  a$.pipe(audit(() => timer(20))).subscribe((v) => console.log("audit:", v));
  a$.next(1);
  a$.next(2);

  const t$ = new Subject();
  t$.pipe(throttle(() => timer(20))).subscribe((v) => console.log("throttle:", v));
  t$.next("A");
  t$.next("B");
}

window.runDemo = runDemo;
runDemo();
