/**
 * DEMO: side-by-side ordering lab for all major scheduler contexts
 * used with creation + observeOn operators.
 */
import {
  of,
  range,
  scheduled,
  observeOn,
  asyncScheduler,
  asapScheduler,
  queueScheduler,
  animationFrameScheduler,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== comparison lab ==========");
  console.log("start");

  // sync (null scheduler)
  of("sync").subscribe((v) => console.log(v));

  // queue via observeOn
  of("queue")
    .pipe(observeOn(queueScheduler))
    .subscribe((v) => console.log(v));

  // asap via scheduled
  scheduled(["asap"], asapScheduler).subscribe((v) => console.log(v));

  // async via scheduled
  scheduled(["async"], asyncScheduler).subscribe((v) => console.log(v));

  // animation frame via observeOn
  of("rAF")
    .pipe(observeOn(animationFrameScheduler))
    .subscribe((v) => console.log(v));

  // range on queue
  range(0, 1, queueScheduler).subscribe(() => console.log("range-queue"));

  console.log("end");
  console.log(
    "Expected idea: start → sync/queue/range-queue → end → asap → async/rAF (rAF vs async order may vary)",
  );
}

window.runDemo = runDemo;
runDemo();
