import { Observable } from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";
// 1. Create
const obs$ = new Observable((subscriber) => {
  console.log("Observable starts");
  subscriber.next(12);
  subscriber.next(18);
  subscriber.next(20);
  // async emission
  const id = setTimeout(() => {
    subscriber.next(50);
    subscriber.complete(); // done — no more values
  }, 1000);
  // 2. Teardown logic — runs on unsubscribe / complete / error
  return () => {
    clearTimeout(id);
    console.log("cleaned up");
  };
});
let sum = 0;
obs$.subscribe({
        next: (value) => {sum += value; console.log(value)},
        complete: () => {console.log("done"); console.log(sum)},
      });
    
// obs$.subscribe();
