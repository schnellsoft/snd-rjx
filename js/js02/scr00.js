import { Subject, map } from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";
import { test, expect } from "../../libs/test.js";

test("doubles values", () => {
  const src = new Subject();
  const out = [];
  src.pipe(map((x) => x * 2)).subscribe((v) => out.push(v));
  src.next(1);
  src.next(2);
  expect(out).toEqual([2, 4]);
});
