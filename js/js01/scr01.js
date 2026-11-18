import { of, reduce } from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

const numbers$ = of(1, 2, 3, 4, 5);

numbers$.pipe(reduce((sum, value) => sum + value, 0)).subscribe({
  next: (sum) => console.log("Sum:", sum),
  error: (error) => console.error("Could not calculate the sum:", error),
});
