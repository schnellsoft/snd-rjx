/**
 * RxJS operators demo — HIGHER-ORDER MAPPING / FLATTENING
 * switchMap, mergeMap, concatMap, exhaustMap, + *All variants
 */
import {
  of,
  timer,
  map,
  delay,
  switchMap,
  mergeMap,
  concatMap,
  exhaustMap,
  mergeAll,
  concatAll,
  switchAll,
  exhaustAll,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== HIGHER-ORDER OPERATORS ==========");

  // Helper: inner Observable that labels itself after a delay
  const inner = (label, ms) => of(`${label}-done`).pipe(delay(ms));

  // --- mergeMap: subscribe to all inners concurrently ---
  console.log("--- mergeMap (parallel) ---");
  of("A", "B")
    .pipe(mergeMap((id) => inner(id, id === "A" ? 30 : 10)))
    .subscribe((v) => console.log("mergeMap:", v));
  // B finishes first typically

  // --- concatMap: run inners one after another (ordered queue) ---
  console.log("--- concatMap (serial) ---");
  of("A", "B")
    .pipe(concatMap((id) => inner(id, 10)))
    .subscribe((v) => console.log("concatMap:", v));
  // A-done then B-done

  // --- switchMap: cancel previous inner on new outer ---
  console.log("--- switchMap (latest only) ---");
  of("A", "B")
    .pipe(switchMap((id) => inner(id, 20)))
    .subscribe((v) => console.log("switchMap:", v));
  // A cancelled; expect B-done

  // --- exhaustMap: ignore new outers while an inner is active ---
  console.log("--- exhaustMap (ignore while busy) ---");
  of("A", "B")
    .pipe(exhaustMap((id) => inner(id, 20)))
    .subscribe((v) => console.log("exhaustMap:", v));
  // B ignored if A still active; expect A-done

  // --- mergeAll: flatten a higher-order Observable (outers emit inners) ---
  console.log("--- mergeAll ---");
  of(inner("X", 10), inner("Y", 10))
    .pipe(mergeAll())
    .subscribe((v) => console.log("mergeAll:", v));

  // --- concatAll: flatten serially ---
  console.log("--- concatAll ---");
  of(inner("X", 10), inner("Y", 10))
    .pipe(concatAll())
    .subscribe((v) => console.log("concatAll:", v));

  // --- switchAll ---
  console.log("--- switchAll ---");
  of(inner("X", 30), inner("Y", 10))
    .pipe(switchAll())
    .subscribe((v) => console.log("switchAll:", v));

  // --- exhaustAll ---
  console.log("--- exhaustAll ---");
  of(inner("X", 30), inner("Y", 10))
    .pipe(exhaustAll())
    .subscribe((v) => console.log("exhaustAll:", v));

  // --- classic switchMap + timer (async demo note) ---
  console.log("--- switchMap(timer) pattern ---");
  of(1)
    .pipe(switchMap(() => timer(0).pipe(map(() => "tick"))))
    .subscribe((v) => console.log("switchMap timer:", v));
}

window.runDemo = runDemo;
runDemo();
