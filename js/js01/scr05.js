import {
  of,
  asyncScheduler,
  observeOn,
  tap,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

// asyncScheduler runs work via setTimeout — after the current call stack clears.
// Contrast: queueScheduler / null = sync; asyncScheduler = macrotask (async).

console.log("1. before subscribe");

of(1, 2, 3)
  .pipe(
    // Without observeOn, next values would run synchronously inside subscribe.
    // observeOn(asyncScheduler) postpones each emission to the next macrotask.
    observeOn(asyncScheduler),
    tap((value) => console.log("2. emitted:", value)),
  )
  .subscribe({
    next: (value) => console.log("3. received:", value),
    complete: () => console.log("4. done"),
  });

console.log("5. after subscribe (runs before any emission)");

// You can also schedule a one-off task directly:
// delay (ms), then optional state passed as the 3rd argument
const handle = asyncScheduler.schedule(
  (label) => console.log("6. scheduled task:", label),
  500,
  "hello from asyncScheduler.schedule",
);

// Teardown: cancel if you unsubscribe / no longer need it
// handle.unsubscribe();
