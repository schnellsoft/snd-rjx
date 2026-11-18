/**
 * DEMO: timeout / timeInterval / timestamp with schedulers
 */
import {
  of,
  NEVER,
  timeout,
  timeInterval,
  timestamp,
  delay,
  catchError,
  asyncScheduler,
  asapScheduler,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== timeout / timeInterval / timestamp ==========");

  // --- timeout: error if too quiet ---
  console.log("--- timeout on NEVER ---");
  NEVER.pipe(
    timeout({ first: 40, scheduler: asyncScheduler }),
    catchError((e) => of("timed-out:" + e.name)),
  ).subscribe((v) => console.log("timeout", v));

  // --- timeout when values arrive in time ---
  of("ok")
    .pipe(
      delay(10),
      timeout({ each: 100, scheduler: asyncScheduler }),
    )
    .subscribe((v) => console.log("timeout-ok", v));

  // --- timeInterval: measure gaps using scheduler.now() ---
  console.log("--- timeInterval ---");
  of(1, 2)
    .pipe(delay(15), timeInterval(asyncScheduler))
    .subscribe((v) => console.log("timeInterval", v));

  // --- timestamp ---
  console.log("--- timestamp ---");
  of("Z")
    .pipe(timestamp(asyncScheduler))
    .subscribe((v) => console.log("timestamp", v));

  of("asap-ts")
    .pipe(timestamp(asapScheduler))
    .subscribe((v) => console.log("timestamp-asap", v));
}

window.runDemo = runDemo;
runDemo();
