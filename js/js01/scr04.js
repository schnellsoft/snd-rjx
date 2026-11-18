import {
  Observable,
  filter,
  map,
  tap,
  reduce,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

const numbers$ = new Observable((subscriber) => {
  console.log("Observable starts");
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.next(4);
  subscriber.next(5);
  subscriber.complete();
});

numbers$
  .pipe(
    tap((value) => console.log("raw:", value)),
    filter((value) => value % 2 === 0),
    tap((value) => console.log("even:", value)),
    map((value) => value * 10),
    tap((value) => console.log("mapped:", value)),
    reduce((sum, value) => sum + value, 0),
  )
  .subscribe({
    next: (sum) => console.log("Sum:", sum),
    error: (error) => console.error("Could not calculate the sum:", error),
    complete: () => console.log("done"),
  });
