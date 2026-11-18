/**
 * RxJS operators demo — FILTER / LIMIT
 */
import {
  of,
  filter,
  take,
  takeLast,
  takeWhile,
  takeUntil,
  skip,
  skipWhile,
  skipLast,
  skipUntil,
  first,
  last,
  elementAt,
  distinct,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  ignoreElements,
  Subject,
  timer,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== FILTER / LIMIT OPERATORS ==========");

  // --- filter ---
  console.log("--- filter ---");
  of(1, 2, 3, 4)
    .pipe(filter((n) => n % 2 === 0))
    .subscribe((v) => console.log("filter:", v));

  // --- take / takeLast ---
  console.log("--- take / takeLast ---");
  of(1, 2, 3, 4).pipe(take(2)).subscribe((v) => console.log("take:", v));
  of(1, 2, 3, 4).pipe(takeLast(2)).subscribe((v) => console.log("takeLast:", v));

  // --- takeWhile: emit while predicate true; then complete ---
  console.log("--- takeWhile ---");
  of(1, 2, 3, 4)
    .pipe(takeWhile((n) => n < 3))
    .subscribe((v) => console.log("takeWhile:", v)); // 1,2

  // --- takeUntil: complete when notifier emits ---
  console.log("--- takeUntil ---");
  const stop$ = new Subject();
  const src = new Subject();
  src.pipe(takeUntil(stop$)).subscribe({
    next: (v) => console.log("takeUntil:", v),
    complete: () => console.log("takeUntil: complete"),
  });
  src.next("a");
  stop$.next();
  src.next("b"); // ignored

  // --- skip / skipWhile / skipLast ---
  console.log("--- skip family ---");
  of(1, 2, 3, 4).pipe(skip(2)).subscribe((v) => console.log("skip:", v));
  of(1, 2, 3, 4)
    .pipe(skipWhile((n) => n < 3))
    .subscribe((v) => console.log("skipWhile:", v));
  of(1, 2, 3, 4).pipe(skipLast(2)).subscribe((v) => console.log("skipLast:", v));

  // --- skipUntil ---
  console.log("--- skipUntil ---");
  const gate$ = new Subject();
  const values$ = new Subject();
  values$.pipe(skipUntil(gate$)).subscribe((v) => console.log("skipUntil:", v));
  values$.next(1); // skipped
  gate$.next("open");
  values$.next(2); // passes

  // --- first / last / elementAt ---
  console.log("--- first / last / elementAt ---");
  of(1, 2, 3).pipe(first()).subscribe((v) => console.log("first:", v));
  of(1, 2, 3).pipe(last()).subscribe((v) => console.log("last:", v));
  of(1, 2, 3).pipe(elementAt(1)).subscribe((v) => console.log("elementAt(1):", v));

  // --- distinct: unique by value (optional key selector); remembers all ---
  console.log("--- distinct ---");
  of(1, 1, 2, 2, 3, 1)
    .pipe(distinct())
    .subscribe((v) => console.log("distinct:", v)); // 1,2,3

  // --- distinctUntilChanged: only vs previous ---
  console.log("--- distinctUntilChanged ---");
  of(1, 1, 2, 2, 1)
    .pipe(distinctUntilChanged())
    .subscribe((v) => console.log("distinctUntilChanged:", v)); // 1,2,1

  // --- distinctUntilKeyChanged ---
  console.log("--- distinctUntilKeyChanged ---");
  of({ id: 1 }, { id: 1 }, { id: 2 })
    .pipe(distinctUntilKeyChanged("id"))
    .subscribe((v) => console.log("distinctUntilKeyChanged:", v));

  // --- ignoreElements: suppress next; only error/complete pass ---
  console.log("--- ignoreElements ---");
  of(1, 2, 3)
    .pipe(ignoreElements())
    .subscribe({
      next: () => console.log("should not run"),
      complete: () => console.log("ignoreElements: complete"),
    });
}

window.runDemo = runDemo;
runDemo();
