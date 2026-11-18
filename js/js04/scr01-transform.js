/**
 * RxJS operators demo — TRANSFORMATION * map, mapTo, pluck-style map, scan, mergeScan, expand, toArray, toPromise-style lastValueFrom note
 */
import {
  of,
  map,
  mapTo,
  scan,
  mergeScan,
  expand,
  take,
  toArray,
  delay,
  reduce,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== TRANSFORMATION OPERATORS ==========");

  // --- map: project each value ---
  console.log("--- map ---");
  of(1, 2, 3)
    .pipe(map((x) => x * 10))
    .subscribe((v) => console.log("map:", v));

  // --- mapTo: emit a constant for every source value (legacy-ish; map(() => x) is fine) ---
  console.log("--- mapTo ---");
  of("a", "b")
    .pipe(mapTo("CLICK"))
    .subscribe((v) => console.log("mapTo:", v));

  // --- pluck replacement: nested property via map ---
  console.log("--- map (pluck style) ---");
  of({ user: { name: "Ada" } })
    .pipe(map((o) => o.user.name))
    .subscribe((v) => console.log("pluck-style:", v));

  // --- scan: running accumulator; emits on every source next ---
  console.log("--- scan ---");
  of(1, 2, 3)
    .pipe(scan((acc, v) => acc + v, 0))
    .subscribe((v) => console.log("scan:", v)); // 1, 3, 6

  // --- reduce: single final accumulator on complete ---
  console.log("--- reduce ---");
  of(1, 2, 3)
    .pipe(reduce((acc, v) => acc + v, 0))
    .subscribe((v) => console.log("reduce:", v)); // 6

  // --- mergeScan: like scan but accumulator step returns an Observable ---
  console.log("--- mergeScan ---");
  of(1, 2)
    .pipe(
      mergeScan((acc, v) => of(acc + v).pipe(delay(0)), 0),
    )
    .subscribe((v) => console.log("mergeScan:", v));

  // --- expand: recursively project values into new Observables (careful: can loop) ---
  console.log("--- expand (with take) ---");
  of(1)
    .pipe(
      expand((x) => of(x + 1)), // would be infinite without take
      take(4),
    )
    .subscribe((v) => console.log("expand:", v)); // 1,2,3,4

  // --- toArray: collect all emissions into one array on complete ---
  console.log("--- toArray ---");
  of(1, 2, 3)
    .pipe(toArray())
    .subscribe((v) => console.log("toArray:", v)); // [1,2,3]
}

window.runDemo = runDemo;
runDemo();
