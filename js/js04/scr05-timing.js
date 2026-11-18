/**
 * RxJS operators demo — TIMING
 * delay, delayWhen, debounceTime, debounce, throttleTime, throttle, auditTime, audit, sampleTime, sample, timeInterval, timestamp, timeout
 */
import {
  of,
  interval,
  timer,
  delay,
  delayWhen,
  debounceTime,
  debounce,
  throttleTime,
  auditTime,
  sampleTime,
  sample,
  timeInterval,
  timestamp,
  timeout,
  take,
  map,
  catchError,
  Subject,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== TIMING OPERATORS ==========");

  // --- delay: shift emissions in time ---
  console.log("--- delay ---");
  of("A")
    .pipe(delay(20))
    .subscribe((v) => console.log("delay:", v));

  // --- delayWhen: per-value delay controlled by an Observable ---
  console.log("--- delayWhen ---");
  of(1, 2)
    .pipe(delayWhen((v) => timer(v * 10)))
    .subscribe((v) => console.log("delayWhen:", v));

  // --- debounceTime: emit after silence window ---
  console.log("--- debounceTime (simulated with Subject) ---");
  const deb$ = new Subject();
  deb$.pipe(debounceTime(30)).subscribe((v) => console.log("debounceTime:", v));
  deb$.next(1);
  deb$.next(2);
  deb$.next(3); // only 3 should pass after quiet period

  // --- debounce: silence duration from a notifier Observable ---
  console.log("--- debounce ---");
  const d$ = new Subject();
  d$.pipe(debounce(() => timer(20))).subscribe((v) => console.log("debounce:", v));
  d$.next("x");
  d$.next("y");

  // --- throttleTime: emit then ignore for duration ---
  console.log("--- throttleTime ---");
  const th$ = new Subject();
  th$.pipe(throttleTime(50)).subscribe((v) => console.log("throttleTime:", v));
  th$.next(1);
  th$.next(2); // likely ignored inside window

  // --- auditTime: ignore for window, then emit last ---
  console.log("--- auditTime ---");
  const au$ = new Subject();
  au$.pipe(auditTime(30)).subscribe((v) => console.log("auditTime:", v));
  au$.next("a");
  au$.next("b");

  // --- sampleTime / sample ---
  console.log("--- sampleTime / sample ---");
  const sm$ = new Subject();
  const tick$ = new Subject();
  sm$.pipe(sample(tick$)).subscribe((v) => console.log("sample:", v));
  sm$.next(10);
  sm$.next(20);
  tick$.next("tick"); // samples 20

  // --- timeInterval / timestamp: metadata wrappers ---
  console.log("--- timeInterval / timestamp ---");
  of(1)
    .pipe(delay(5), timeInterval())
    .subscribe((v) => console.log("timeInterval:", v));
  of("z")
    .pipe(timestamp())
    .subscribe((v) => console.log("timestamp:", v));

  // --- timeout: error if no emission within ms ---
  console.log("--- timeout ---");
  of("ok")
    .pipe(
      delay(5),
      timeout(100),
      catchError((e) => of("timeout-or-ok:" + e.name)),
    )
    .subscribe((v) => console.log("timeout path:", v));

  // --- interval + take (classic timing source) ---
  console.log("--- interval+take (cancelled immediately to keep demo quiet) ---");
  const sub = interval(1000).pipe(take(3)).subscribe();
  sub.unsubscribe();
}

window.runDemo = runDemo;
runDemo();
