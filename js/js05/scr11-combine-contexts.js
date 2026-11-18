/**
 * DEMO: combining subscribeOn + observeOn + timed ops
 * Shows a realistic pipeline with multiple scheduler touchpoints.
 */
import {
  of,
  map,
  tap,
  delay,
  observeOn,
  subscribeOn,
  asyncScheduler,
  asapScheduler,
  animationFrameScheduler,
  queueScheduler,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== combined scheduler pipeline ==========");

  console.log("1 sync start");

  of(1, 2, 3)
    .pipe(
      // delay starting the source until a macrotask
      subscribeOn(asyncScheduler),
      tap((v) => console.log("2 source", v)),
      // project
      map((v) => v * 10),
      // optional time shift on async clock
      delay(10, asyncScheduler),
      // deliver to UI-ish context
      observeOn(animationFrameScheduler),
      tap((v) => console.log("3 on rAF", v, performance.now().toFixed(0))),
    )
    .subscribe((v) => console.log("4 view", v));

  console.log("5 sync end (source not started yet)");

  // contrast: queue then asap
  of("Q")
    .pipe(
      subscribeOn(queueScheduler),
      observeOn(asapScheduler),
    )
    .subscribe((v) => console.log("queue→asap", v));
}

window.runDemo = runDemo;
runDemo();
