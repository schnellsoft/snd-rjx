import {
  Observable,
  Subject,
  multicast,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";
import { test, expect } from "../../libs/test.js";
import { createRefCounted, createRefCountLab } from "./scr04.js";

test("refCount connects on first subscribe only", () => {
  const { shared$, stats } = createRefCountLab();
  const a = [];
  const b = [];

  const subA = shared$.subscribe((v) => a.push(v));
  expect(stats()).toEqual({ starts: 1, stops: 0 });
  expect(a).toEqual(["start#1"]);

  const subB = shared$.subscribe((v) => b.push(v));
  // still one producer — shared execution
  expect(stats()).toEqual({ starts: 1, stops: 0 });
  // plain Subject hub: B misses the earlier emission
  expect(b).toEqual([]);

  subA.unsubscribe();
  expect(stats()).toEqual({ starts: 1, stops: 0 }); // B still active

  subB.unsubscribe();
  expect(stats()).toEqual({ starts: 1, stops: 1 }); // last subscriber -> disconnect
});

test("refCount restarts after all subscribers leave (Subject factory)", () => {
  const { shared$, stats } = createRefCountLab();

  const first = shared$.subscribe(() => {});
  expect(stats().starts).toEqual(1);
  first.unsubscribe();
  expect(stats()).toEqual({ starts: 1, stops: 1 });

  const seen = [];
  const second = shared$.subscribe((v) => seen.push(v));
  expect(stats()).toEqual({ starts: 2, stops: 1 });
  expect(seen).toEqual(["start#2"]);
  second.unsubscribe();
  expect(stats()).toEqual({ starts: 2, stops: 2 });
});

test("createRefCounted shares live values with two subscribers", () => {
  const source = new Subject();
  const shared$ = createRefCounted(source);
  const a = [];
  const b = [];

  shared$.subscribe((v) => a.push(v)); // connects
  shared$.subscribe((v) => b.push(v));

  source.next(10);
  source.next(20);

  expect(a).toEqual([10, 20]);
  expect(b).toEqual([10, 20]);
});

test("without refCount, source does not start on subscribe alone", () => {
  let starts = 0;
  const source = new Observable((subscriber) => {
    starts += 1;
    subscriber.next(1);
  });
  const multicasted = source.pipe(multicast(() => new Subject()));

  multicasted.subscribe(() => {});
  expect(starts).toEqual(0); // still needs connect()

  multicasted.connect();
  expect(starts).toEqual(1);
});
