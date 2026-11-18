/**
 * RxJS operators demo — COMBINATION
 * combineLatest, withLatestFrom, forkJoin, merge, concat, zip, race, startWith, endWith, pairwise
 */
import {
  of,
  combineLatest,
  withLatestFrom,
  forkJoin,
  merge,
  concat,
  zip,
  race,
  startWith,
  endWith,
  pairwise,
  map,
  delay,
  take,
  timer,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== COMBINATION OPERATORS ==========");

  // --- combineLatest: after each source has emitted once, emit latest tuple on any change ---
  console.log("--- combineLatest ---");
  combineLatest([of("A").pipe(delay(10)), of(1, 2)])
    .subscribe((v) => console.log("combineLatest:", v));

  // --- withLatestFrom: primary drives; sample latest from others ---
  console.log("--- withLatestFrom ---");
  of("click1", "click2")
    .pipe(withLatestFrom(of("state-v1")))
    .subscribe((v) => console.log("withLatestFrom:", v));

  // --- forkJoin: wait for all to complete; emit last values (Promise.all style) ---
  console.log("--- forkJoin ---");
  forkJoin({
    a: of(1).pipe(delay(10)),
    b: of("x"),
  }).subscribe((v) => console.log("forkJoin:", v));

  // --- merge: interleave multiple sources ---
  console.log("--- merge ---");
  merge(of(1, 2), of(3, 4)).subscribe((v) => console.log("merge:", v));

  // --- concat: play sources one after another (needs completion) ---
  console.log("--- concat ---");
  concat(of(1, 2), of(3, 4)).subscribe((v) => console.log("concat:", v));

  // --- zip: pair by index ---
  console.log("--- zip ---");
  zip(of("a", "b", "c"), of(1, 2)).subscribe((v) => console.log("zip:", v));
  // ["a",1], ["b",2] — "c" unused

  // --- race: first source to emit wins; others unsubscribed ---
  console.log("--- race ---");
  race(of("slow").pipe(delay(50)), of("fast").pipe(delay(10))).subscribe((v) =>
    console.log("race:", v),
  );

  // --- startWith / endWith ---
  console.log("--- startWith / endWith ---");
  of("b")
    .pipe(startWith("a"), endWith("c"))
    .subscribe((v) => console.log("start/end:", v));

  // --- pairwise: emit [previous, current] ---
  console.log("--- pairwise ---");
  of(1, 2, 3)
    .pipe(pairwise())
    .subscribe((v) => console.log("pairwise:", v)); // [1,2], [2,3]
}

window.runDemo = runDemo;
runDemo();
