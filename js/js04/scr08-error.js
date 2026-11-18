/**
 * RxJS operators demo — ERROR HANDLING
 * catchError, retry, retryWhen, onErrorResumeNext, throwIfEmpty, timeout (see timing)
 */
import {
  of,
  throwError,
  catchError,
  retry,
  retryWhen,
  delay,
  take,
  onErrorResumeNext,
  throwIfEmpty,
  EMPTY,
  tap,
  mergeMap,
  timer,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== ERROR HANDLING OPERATORS ==========");

  // --- catchError: replace the failed stream with another Observable ---
  console.log("--- catchError ---");
  throwError(() => new Error("network"))
    .pipe(
      catchError((err) => {
        console.log("caught:", err.message);
        return of("fallback");
      }),
    )
    .subscribe((v) => console.log("catchError result:", v));

  // --- retry: resubscribe to source N times on error ---
  console.log("--- retry ---");
  let attempts = 0;
  of(null)
    .pipe(
      mergeMap(() => {
        attempts += 1;
        return attempts < 3
          ? throwError(() => new Error("try-again"))
          : of("success-after-retries");
      }),
      retry(2),
    )
    .subscribe({
      next: (v) => console.log("retry:", v),
      error: (e) => console.log("retry failed:", e.message),
    });

  // --- retryWhen: custom retry logic based on error stream ---
  console.log("--- retryWhen ---");
  let n = 0;
  of(true)
    .pipe(
      mergeMap(() => {
        n += 1;
        return n < 2
          ? throwError(() => new Error("transient"))
          : of("ok");
      }),
      retryWhen((errors$) =>
        errors$.pipe(
          tap((e) => console.log("retryWhen saw:", e.message)),
          delay(10),
          take(3), // stop retrying after 3 error notifications
        ),
      ),
    )
    .subscribe((v) => console.log("retryWhen:", v));

  // --- onErrorResumeNext: on error, continue with next sources ---
  console.log("--- onErrorResumeNext ---");
  onErrorResumeNext(
    throwError(() => new Error("boom")),
    of("recovered-1"),
    of("recovered-2"),
  ).subscribe((v) => console.log("onErrorResumeNext:", v));

  // --- throwIfEmpty: error if source completes without next ---
  console.log("--- throwIfEmpty ---");
  EMPTY.pipe(
    throwIfEmpty(() => new Error("empty!")),
    catchError((e) => of("throwIfEmpty handled: " + e.message)),
  ).subscribe((v) => console.log(v));
}

window.runDemo = runDemo;
runDemo();
