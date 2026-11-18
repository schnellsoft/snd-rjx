/**
 * RxJS operators demo — CREATION
 * Producers that build Observables (usually sources, not always inside pipe).
 */
import {
  Observable,
  of,
  from,
  fromEvent,
  interval,
  timer,
  range,
  defer,
  iif,
  generate,
  EMPTY,
  NEVER,
  throwError,
  scheduled,
  asyncScheduler,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== CREATION OPERATORS ==========");

  // --- of: emit arguments synchronously, then complete ---
  console.log("--- of ---");
  of(1, 2, 3).subscribe({
    next: (v) => console.log("of:", v),
    complete: () => console.log("of: complete"),
  });

  // --- from: convert array / Promise / iterable ---
  console.log("--- from(array) ---");
  from([10, 20]).subscribe((v) => console.log("from array:", v));

  console.log("--- from(Promise) ---");
  from(Promise.resolve("ok")).subscribe((v) => console.log("from promise:", v));

  // --- fromEvent: DOM (or EventTarget) events as a stream ---
  console.log("--- fromEvent (click body once logged via take in spirit; here we just create) ---");
  const clicks$ = fromEvent(document, "click");
  // Not subscribed long-term in this demo to avoid noise; pattern:
  // clicks$.subscribe((e) => console.log("click", e.clientX));

  // --- interval: infinite numbers every period ms (asyncScheduler) ---
  console.log("--- interval (take first value via manual unsubscribe quickly) ---");
  const iv = interval(1000).subscribe((n) => {
    console.log("interval:", n);
    iv.unsubscribe(); // demo only first tick setup; may fire once
  });
  iv.unsubscribe(); // cancel immediately so demo stays sync-friendly
  console.log("(interval subscription cancelled before tick for quiet demo)");

  // --- timer: delay then optional period ---
  console.log("--- timer(0) emits 0 ASAP on async path ---");
  timer(0).subscribe((n) => console.log("timer(0):", n));

  // --- range: sync integers start..count ---
  console.log("--- range ---");
  range(5, 3).subscribe((v) => console.log("range:", v)); // 5,6,7

  // --- defer: run factory per subscribe (lazy fresh Observable) ---
  console.log("--- defer ---");
  const now$ = defer(() => of(Date.now()));
  now$.subscribe((t) => console.log("defer t1:", t));
  now$.subscribe((t) => console.log("defer t2:", t));

  // --- iif: choose between two Observables based on condition at subscribe ---
  console.log("--- iif ---");
  let premium = false;
  const plan$ = iif(
    () => premium,
    of("premium-data"),
    of("free-data"),
  );
  plan$.subscribe((v) => console.log("iif:", v));
  premium = true;
  plan$.subscribe((v) => console.log("iif:", v));

  // --- generate: like a for-loop as an Observable ---
  console.log("--- generate ---");
  generate({
    initialState: 0,
    condition: (x) => x < 3,
    iterate: (x) => x + 1,
    resultSelector: (x) => `n=${x}`,
  }).subscribe((v) => console.log("generate:", v));

  // --- EMPTY: complete immediately with no values ---
  console.log("--- EMPTY ---");
  EMPTY.subscribe({
    next: () => console.log("never"),
    complete: () => console.log("EMPTY complete"),
  });

  // --- NEVER: neither next nor complete (hangs forever) ---
  console.log("--- NEVER (subscribe then unsubscribe) ---");
  const neverSub = NEVER.subscribe({
    next: () => console.log("never next"),
    complete: () => console.log("never complete"),
  });
  neverSub.unsubscribe();

  // --- throwError: emit error on subscribe ---
  console.log("--- throwError ---");
  throwError(() => new Error("boom")).subscribe({
    error: (e) => console.log("throwError:", e.message),
  });

  // --- scheduled: emit values on a given scheduler ---
  console.log("--- scheduled(array, asyncScheduler) ---");
  scheduled([7, 8], asyncScheduler).subscribe((v) =>
    console.log("scheduled:", v),
  );

  // --- new Observable: custom producer + teardown ---
  console.log("--- new Observable ---");
  new Observable((subscriber) => {
    subscriber.next("custom");
    subscriber.complete();
    return () => console.log("custom teardown");
  }).subscribe((v) => console.log("custom:", v));
}

window.runDemo = runDemo;
runDemo();
