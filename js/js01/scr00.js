import { of, map } from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";
of("hello", "world", "foo", "bar")
  .pipe(map((s) => (s !== "hello" ? s.toUpperCase() : s)))
  .subscribe(console.log);
