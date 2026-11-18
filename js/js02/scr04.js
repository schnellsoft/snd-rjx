import {
  Observable,
  Subject,
  interval,
  multicast,
  refCount,
  tap,
  take,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

/**
 * Shared stream: first subscribe auto-connects, last unsubscribe auto-disconnects.
 * Uses a Subject factory so a later re-subscribe can start a fresh hub.
 */
export function createRefCounted(source) {
  return source.pipe(
    multicast(() => new Subject()),
    refCount(),
  );
}

/**
 * Lab helper for tests/demos: counts how many times the producer starts/stops.
 * Source stays open until unsubscribe (no complete), so multiple subscribers share one run.
 */
export function createRefCountLab() {
  let starts = 0;
  let stops = 0;

  const source = new Observable((subscriber) => {
    starts += 1;
    subscriber.next(`start#${starts}`);
    return () => {
      stops += 1;
    };
  });

  const shared$ = createRefCounted(source);

  return {
    shared$,
    stats: () => ({ starts, stops }),
  };
}

/** Browser demo: interval shared via multicast + refCount (no manual connect). */
export function runDemo() {
  console.log("--- refCount demo ---");
  console.log("No connect() call: first subscribe connects, last unsubscribe disconnects.");

  const source = interval(1000).pipe(
    tap((n) => console.log("SOURCE produced", n)),
    take(20),
  );

  const shared$ = createRefCounted(source);

  const subA = shared$.subscribe((x) => console.log("A", x));
  console.log("A subscribed -> source should start");

  const subB = shared$.subscribe((x) => console.log("B", x));
  console.log("B subscribed -> source should NOT restart");

  setTimeout(() => {
    const subC = shared$.subscribe((x) => console.log("C", x));
    console.log("C subscribed (late)");

    setTimeout(() => {
      subA.unsubscribe();
      subB.unsubscribe();
      console.log("A and B unsubscribed; C still listening -> source keeps running");

      setTimeout(() => {
        subC.unsubscribe();
        console.log("C unsubscribed (last) -> source should stop");
      }, 2000);
    }, 2000);
  }, 3000);

  return { shared$, subA, subB };
}

// Expose for DevTools: runDemo()
window.runDemo = runDemo;
