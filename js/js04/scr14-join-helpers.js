/**
 * RxJS operators demo — JOIN HELPERS / WITH SUFFIXES (RxJS 7+)
 * concatWith, mergeWith, raceWith, zipWith, combineLatestWith,
 * combineLatestAll, concatAll (see higher-order), mergeAll, switchAll
 */
import {
  of,
  map,
  delay,
  concatWith,
  mergeWith,
  raceWith,
  zipWith,
  combineLatestWith,
  combineLatestAll,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== JOIN HELPER OPERATORS ==========");

  // --- concatWith: pipeable concat ---
  console.log("--- concatWith ---");
  of(1, 2)
    .pipe(concatWith(of(3, 4)))
    .subscribe((v) => console.log("concatWith:", v));

  // --- mergeWith: pipeable merge ---
  console.log("--- mergeWith ---");
  of(1)
    .pipe(mergeWith(of(2), of(3)))
    .subscribe((v) => console.log("mergeWith:", v));

  // --- raceWith ---
  console.log("--- raceWith ---");
  of("slow")
    .pipe(delay(40), raceWith(of("fast").pipe(delay(10))))
    .subscribe((v) => console.log("raceWith:", v));

  // --- zipWith ---
  console.log("--- zipWith ---");
  of("a", "b")
    .pipe(zipWith(of(1, 2, 3)))
    .subscribe((v) => console.log("zipWith:", v));

  // --- combineLatestWith ---
  console.log("--- combineLatestWith ---");
  of("L")
    .pipe(combineLatestWith(of("R")))
    .subscribe((v) => console.log("combineLatestWith:", v));

  // --- combineLatestAll: higher-order; each emission is an Observable ---
  console.log("--- combineLatestAll ---");
  of(of(1, 2), of("x", "y"))
    .pipe(combineLatestAll())
    .subscribe((v) => console.log("combineLatestAll:", v));
}

window.runDemo = runDemo;
runDemo();
