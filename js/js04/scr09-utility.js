/**
 * RxJS operators demo — UTILITY / SIDE EFFECTS / SCHEDULING HOOKS
 * tap, finalize, delay (see timing), observeOn, subscribeOn, tap finalize, finalize,
 * dematerialize, materialize, toArray already covered, count as util? keep here: tap, finalize,
 * materialize, dematerialize, timeoutWith note, pipe identity
 */
import {
  of,
  tap,
  finalize,
  materialize,
  dematerialize,
  observeOn,
  subscribeOn,
  asyncScheduler,
  map,
  Notification,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== UTILITY OPERATORS ==========");

  // --- tap: side effects; values pass through unchanged ---
  console.log("--- tap ---");
  of(1, 2)
    .pipe(
      tap({
        next: (v) => console.log("tap next:", v),
        complete: () => console.log("tap complete"),
      }),
      map((v) => v * 2),
    )
    .subscribe((v) => console.log("after map:", v));

  // --- finalize: always runs on unsubscribe or settle (complete/error) ---
  console.log("--- finalize ---");
  of(1)
    .pipe(finalize(() => console.log("finalize ran")))
    .subscribe();

  // --- materialize: convert next/error/complete into Notification objects ---
  console.log("--- materialize ---");
  of(1, 2)
    .pipe(materialize())
    .subscribe((n) => console.log("materialize:", n.kind, n.value));

  // --- dematerialize: Notification stream → normal emissions ---
  console.log("--- dematerialize ---");
  of(Notification.createNext("A"), Notification.createComplete())
    .pipe(dematerialize())
    .subscribe({
      next: (v) => console.log("dematerialize:", v),
      complete: () => console.log("dematerialize complete"),
    });

  // --- observeOn: deliver notifications on a scheduler ---
  console.log("--- observeOn(asyncScheduler) ---");
  console.log("before observeOn subscribe");
  of("x")
    .pipe(observeOn(asyncScheduler))
    .subscribe((v) => console.log("observeOn:", v));
  console.log("after observeOn subscribe");

  // --- subscribeOn: delay the subscription itself ---
  console.log("--- subscribeOn(asyncScheduler) ---");
  console.log("before subscribeOn subscribe");
  of("y")
    .pipe(
      tap(() => console.log("source ran")),
      subscribeOn(asyncScheduler),
    )
    .subscribe((v) => console.log("subscribeOn:", v));
  console.log("after subscribeOn subscribe");
}

window.runDemo = runDemo;
runDemo();
