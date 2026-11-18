/**
 * RxJS operators demo — CONDITIONAL / BOOLEAN
 * defaultIfEmpty, every, find, findIndex, isEmpty, sequenceEqual
 */
import {
  of,
  EMPTY,
  defaultIfEmpty,
  every,
  find,
  findIndex,
  isEmpty,
  sequenceEqual,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== CONDITIONAL / BOOLEAN OPERATORS ==========");

  // --- defaultIfEmpty: if no next before complete, emit default ---
  console.log("--- defaultIfEmpty ---");
  EMPTY.pipe(defaultIfEmpty("nothing")).subscribe((v) =>
    console.log("defaultIfEmpty:", v),
  );
  of(1).pipe(defaultIfEmpty("nothing")).subscribe((v) =>
    console.log("defaultIfEmpty (non-empty):", v),
  );

  // --- every: true if all values pass predicate (emits on complete) ---
  console.log("--- every ---");
  of(2, 4, 6)
    .pipe(every((n) => n % 2 === 0))
    .subscribe((v) => console.log("every:", v)); // true
  of(2, 3, 6)
    .pipe(every((n) => n % 2 === 0))
    .subscribe((v) => console.log("every:", v)); // false (and may complete early)

  // --- find / findIndex: first match then complete ---
  console.log("--- find / findIndex ---");
  of(1, 2, 3, 4)
    .pipe(find((n) => n > 2))
    .subscribe((v) => console.log("find:", v)); // 3
  of(1, 2, 3, 4)
    .pipe(findIndex((n) => n > 2))
    .subscribe((v) => console.log("findIndex:", v)); // 2

  // --- isEmpty: true if complete without next ---
  console.log("--- isEmpty ---");
  EMPTY.pipe(isEmpty()).subscribe((v) => console.log("isEmpty EMPTY:", v));
  of(1).pipe(isEmpty()).subscribe((v) => console.log("isEmpty of(1):", v));

  // --- sequenceEqual: compare to another Observable's sequence ---
  console.log("--- sequenceEqual ---");
  of(1, 2, 3)
    .pipe(sequenceEqual(of(1, 2, 3)))
    .subscribe((v) => console.log("sequenceEqual same:", v));
  of(1, 2, 3)
    .pipe(sequenceEqual(of(1, 2, 9)))
    .subscribe((v) => console.log("sequenceEqual diff:", v));
}

window.runDemo = runDemo;
runDemo();
