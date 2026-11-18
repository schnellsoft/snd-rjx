import { Observable } from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

const url = "https://jsonplaceholder.typicode.com/todos/1";

const fetch$ = new Observable((subscriber) => {
  const controller = new AbortController();

  fetch(url, { signal: controller.signal })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      subscriber.next(data);
      subscriber.complete();
    })
    .catch((error) => {
      // AbortError is expected when we unsubscribe — don't treat it as a stream error
      if (error.name !== "AbortError") {
        subscriber.error(error);
      }
    });

  // Teardown: cancel the in-flight request on unsubscribe
  return () => controller.abort();
});

fetch$.subscribe({
  next: (data) => console.log("todo:", data),
  error: (error) => console.error("fetch failed:", error),
  complete: () => console.log("done"),
});
