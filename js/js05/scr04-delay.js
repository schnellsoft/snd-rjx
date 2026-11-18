/**
 * DEMO: delay / delayWhen with schedulers
 */
import {
  of,
  delay,
  delayWhen,
  timer,
  asyncScheduler,
  asapScheduler,
  queueScheduler,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== delay / delayWhen ==========");

  // --- delay(ms) uses asyncScheduler by default ---
  console.log("--- delay(40) ---");
  console.log("before delay");
  of("A")
    .pipe(delay(40))
    .subscribe((v) => console.log("delay-default", v));
  console.log("after delay subscribe");

  // --- delay(ms, scheduler) ---
  console.log("--- delay(20, asapScheduler) ---");
  of("B")
    .pipe(delay(20, asapScheduler))
    .subscribe((v) => console.log("delay-asap", v));

  // Note: delay with queueScheduler still respects delay semantics via that clock
  of("C")
    .pipe(delay(0, queueScheduler))
    .subscribe((v) => console.log("delay-queue0", v));

  // --- delayWhen: per-value delay via notifier (timer → asyncScheduler) ---
  console.log("--- delayWhen(v => timer(v*15)) ---");
  of(1, 2)
    .pipe(delayWhen((v) => timer(v * 15)))
    .subscribe((v) => console.log("delayWhen", v));

  // --- delayWhen with explicit timer scheduler ---
  of("Z")
    .pipe(delayWhen(() => timer(10, asyncScheduler)))
    .subscribe((v) => console.log("delayWhen-async-timer", v));
}

window.runDemo = runDemo;
runDemo();
