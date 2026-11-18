/**
 * RxJS operators demo — GROUPING / PARTITION
 * groupBy, partition
 */
import {
  of,
  groupBy,
  mergeMap,
  reduce,
  map,
  partition,
  tap,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== GROUPING OPERATORS ==========");

  // --- groupBy: split into keyed GroupedObservables ---
  console.log("--- groupBy ---");
  of(
    { type: "a", v: 1 },
    { type: "b", v: 2 },
    { type: "a", v: 3 },
  )
    .pipe(
      groupBy((item) => item.type),
      // each group$ has .key; collect values per group
      mergeMap((group$) =>
        group$.pipe(
          reduce((arr, item) => [...arr, item.v], []),
          map((values) => ({ key: group$.key, values })),
        ),
      ),
    )
    .subscribe((g) => console.log("groupBy:", g));

  // --- partition: returns [true$, false$] Observables (creation-style helper) ---
  console.log("--- partition ---");
  const [evens$, odds$] = partition(of(1, 2, 3, 4, 5), (n) => n % 2 === 0);
  evens$.subscribe((v) => console.log("even:", v));
  odds$.subscribe((v) => console.log("odd:", v));
}

window.runDemo = runDemo;
runDemo();
