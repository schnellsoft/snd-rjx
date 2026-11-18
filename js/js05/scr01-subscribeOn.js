/**
 * DEMO: subscribeOn(scheduler) — delay WHEN the source is subscribed.
 */
import {
  of,
  subscribeOn,
  tap,
  asyncScheduler,
  asapScheduler,
  queueScheduler,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== subscribeOn ==========");

  console.log("--- subscribeOn(asyncScheduler) ---");
  console.log("1 before");
  of("X")
    .pipe(
      tap(() => console.log("2 source subscribed/emitted")),
      subscribeOn(asyncScheduler),
    )
    .subscribe((v) => console.log("3 recv", v));
  console.log("4 after (source has NOT run yet)");

  console.log("--- subscribeOn(asapScheduler) ---");
  console.log("a before");
  of("Y")
    .pipe(
      tap(() => console.log("b source")),
      subscribeOn(asapScheduler),
    )
    .subscribe((v) => console.log("c", v));
  console.log("d after");

  console.log("--- subscribeOn(queueScheduler) ---");
  of("Z")
    .pipe(
      tap(() => console.log("queue source")),
      subscribeOn(queueScheduler),
    )
    .subscribe((v) => console.log("queue recv", v));
  console.log("after queue subscribeOn");
}

window.runDemo = runDemo;
runDemo();
