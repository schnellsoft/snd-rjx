/**
 * RxJS operators demo — AGGREGATION / MATH
 * count, max, min, reduce (also in transform), scan
 */
import {
  of,
  count,
  max,
  min,
  reduce,
  scan,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== AGGREGATION OPERATORS ==========");

  // --- count: number of emissions (optional predicate) ---
  console.log("--- count ---");
  of(1, 2, 3, 4)
    .pipe(count())
    .subscribe((v) => console.log("count:", v)); // 4
  of(1, 2, 3, 4)
    .pipe(count((n) => n % 2 === 0))
    .subscribe((v) => console.log("count even:", v)); // 2

  // --- max / min ---
  console.log("--- max / min ---");
  of(3, 1, 4, 1, 5)
    .pipe(max())
    .subscribe((v) => console.log("max:", v));
  of(3, 1, 4, 1, 5)
    .pipe(min())
    .subscribe((v) => console.log("min:", v));

  // custom comparer
  of({ n: 2 }, { n: 9 }, { n: 4 })
    .pipe(max((a, b) => (a.n < b.n ? -1 : 1)))
    .subscribe((v) => console.log("max by n:", v));

  // --- reduce / scan (aggregation forms) ---
  console.log("--- reduce / scan ---");
  of(1, 2, 3)
    .pipe(reduce((a, b) => a + b, 0))
    .subscribe((v) => console.log("reduce sum:", v));
  of(1, 2, 3)
    .pipe(scan((a, b) => a + b, 0))
    .subscribe((v) => console.log("scan sums:", v));
}

window.runDemo = runDemo;
runDemo();
