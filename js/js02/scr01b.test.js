import {
  from,
  Subject,
  multicast,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";
import { test, expect } from "../../libs/test.js";
import { trackSubject, trackConnectable } from "./scr01b.js";

test("trackSubject counts subscribe and next calls", () => {
  const subject = trackSubject(new Subject());
  const seen = [];

  expect(subject.subscriberCount).toEqual(0);
  expect(subject.nextCallCount).toEqual(0);

  const sub = subject.subscribe((v) => seen.push(v));
  expect(subject.subscriberCount).toEqual(1);

  subject.next(10);
  subject.next(20);
  expect(subject.nextCallCount).toEqual(2);
  expect(seen).toEqual([10, 20]);

  sub.unsubscribe();
  expect(subject.subscriberCount).toEqual(0);
});

test("trackConnectable counts subscribers and value deliveries", () => {
  const source = from([1, 2, 3]);
  const subject = trackSubject(new Subject());
  const multicastSource = trackConnectable(source.pipe(multicast(subject)));
  const a = [];
  const b = [];

  multicastSource.subscribe((v) => a.push(v));
  multicastSource.subscribe((v) => b.push(v));
  expect(multicastSource.subscriberCount).toEqual(2);
  expect(multicastSource.nextCallCount).toEqual(0);

  multicastSource.connect();

  // 3 source values × 2 subscribers = 6 deliveries
  expect(a).toEqual([1, 2, 3]);
  expect(b).toEqual([1, 2, 3]);
  expect(multicastSource.nextCallCount).toEqual(6);
  // source forwarded 1,2,3 into the subject
  expect(subject.nextCallCount).toEqual(3);
});

test("manual subject.next notifies connectable subscribers before connect", () => {
  const source = from([1, 2, 3, 4, 5]);
  const subject = trackSubject(new Subject());
  const multicastSource = trackConnectable(source.pipe(multicast(subject)));
  const out1 = [];
  const out2 = [];

  multicastSource.subscribe((v) => out1.push(v));
  multicastSource.subscribe((v) => out2.push(v));

  subject.next(6);
  subject.next(7);

  expect(out1).toEqual([6, 7]);
  expect(out2).toEqual([6, 7]);
  expect(subject.nextCallCount).toEqual(2);
  // 2 next × 2 subscribers
  expect(multicastSource.nextCallCount).toEqual(4);
});

test("full scr01b scenario counters after connect", () => {
  const source = from([1, 2, 3, 4, 5]);
  const subject = trackSubject(new Subject());
  const multicastSource = trackConnectable(source.pipe(multicast(subject)));
  const received = [[], [], []];

  multicastSource.subscribe((v) => received[0].push(v));
  multicastSource.subscribe((v) => received[1].push(v));
  expect(multicastSource.subscriberCount).toEqual(2);

  subject.next(6);
  subject.next(7);
  expect(subject.nextCallCount).toEqual(2);
  expect(multicastSource.nextCallCount).toEqual(4);

  multicastSource.subscribe((v) => received[2].push(v));
  expect(multicastSource.subscriberCount).toEqual(3);

  multicastSource.connect();

  expect(received[0]).toEqual([6, 7, 1, 2, 3, 4, 5]);
  expect(received[1]).toEqual([6, 7, 1, 2, 3, 4, 5]);
  // subscriber 3 joined after 6/7
  expect(received[2]).toEqual([1, 2, 3, 4, 5]);

  // 2 manual next + 5 from source
  expect(subject.nextCallCount).toEqual(7);
  // before connect: 4 deliveries; after: 5 values × 3 subscribers = 15; total 19
  expect(multicastSource.nextCallCount).toEqual(19);
  expect(typeof multicastSource.connect).toEqual("function");
});
