/**
 * DEMO: debounceTime / throttleTime / auditTime / sampleTime + scheduler
 * Also notifier forms: debounce / throttle / audit / sample
 */
import {
  Subject,
  debounceTime,
  throttleTime,
  auditTime,
  sampleTime,
  debounce,
  throttle,
  audit,
  sample,
  timer,
  asyncScheduler,
  animationFrameScheduler,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== debounce / throttle / audit / sample ==========");

  // --- debounceTime(ms, scheduler?) ---
  console.log("--- debounceTime(30) ---");
  const d$ = new Subject();
  d$.pipe(debounceTime(30, asyncScheduler)).subscribe((v) =>
    console.log("debounceTime", v),
  );
  d$.next(1);
  d$.next(2);
  d$.next(3); // expect 3 after quiet period

  // --- throttleTime ---
  console.log("--- throttleTime(40) ---");
  const t$ = new Subject();
  t$
    .pipe(throttleTime(40, asyncScheduler, { leading: true, trailing: true }))
    .subscribe((v) => console.log("throttleTime", v));
  t$.next("a");
  t$.next("b");

  // --- auditTime ---
  console.log("--- auditTime(30) ---");
  const a$ = new Subject();
  a$.pipe(auditTime(30, asyncScheduler)).subscribe((v) =>
    console.log("auditTime", v),
  );
  a$.next("x");
  a$.next("y");

  // --- sampleTime ---
  console.log("--- sampleTime(30) ---");
  const s$ = new Subject();
  s$.pipe(sampleTime(30, asyncScheduler)).subscribe((v) =>
    console.log("sampleTime", v),
  );
  s$.next(10);
  s$.next(20);

  // --- notifier forms (scheduler enters through timer) ---
  console.log("--- debounce(() => timer(20)) ---");
  const dn$ = new Subject();
  dn$.pipe(debounce(() => timer(20))).subscribe((v) =>
    console.log("debounce-notifier", v),
  );
  dn$.next("p");
  dn$.next("q");

  console.log("--- throttle(() => timer(20)) ---");
  const tn$ = new Subject();
  tn$.pipe(throttle(() => timer(20))).subscribe((v) =>
    console.log("throttle-notifier", v),
  );
  tn$.next(1);
  tn$.next(2);

  console.log("--- audit(() => timer(20)) ---");
  const an$ = new Subject();
  an$.pipe(audit(() => timer(20))).subscribe((v) =>
    console.log("audit-notifier", v),
  );
  an$.next("m");
  an$.next("n");

  console.log("--- sample(notifier) ---");
  const vals$ = new Subject();
  const tick$ = new Subject();
  vals$.pipe(sample(tick$)).subscribe((v) => console.log("sample", v));
  vals$.next(100);
  vals$.next(200);
  tick$.next("tick"); // samples 200

  // --- debounceTime with animationFrameScheduler (unusual but valid) ---
  const af$ = new Subject();
  af$
    .pipe(debounceTime(0, animationFrameScheduler))
    .subscribe((v) => console.log("debounceTime-rAF", v));
  af$.next("frame-debounced");
}

window.runDemo = runDemo;
runDemo();
