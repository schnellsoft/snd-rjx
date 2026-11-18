import {
  from,
  Subject,
  multicast,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

/** Attach subscriberCount + nextCallCount to a Subject (counts .subscribe / .next). */
export function trackSubject(subject) {
  subject.subscriberCount = 0;
  subject.nextCallCount = 0;

  const originalSubscribe = subject.subscribe.bind(subject);
  const originalNext = subject.next.bind(subject);

  subject.subscribe = (...args) => {
    subject.subscriberCount++;
    const subscription = originalSubscribe(...args);
    const originalUnsubscribe = subscription.unsubscribe.bind(subscription);
    subscription.unsubscribe = () => {
      subject.subscriberCount = Math.max(0, subject.subscriberCount - 1);
      return originalUnsubscribe();
    };
    return subscription;
  };

  subject.next = (value) => {
    subject.nextCallCount++;
    return originalNext(value);
  };

  return subject;
}

/**
 * Attach subscriberCount + nextCallCount to a ConnectableObservable.
 * - subscriberCount: how many times .subscribe was called (active-ish)
 * - nextCallCount: how many value deliveries reached subscribers
 *   (ConnectableObservable has no .next; we count observer next notifications)
 */
export function trackConnectable(connectable) {
  connectable.subscriberCount = 0;
  connectable.nextCallCount = 0;

  const originalSubscribe = connectable.subscribe.bind(connectable);

  connectable.subscribe = (observerOrNext, error, complete) => {
    connectable.subscriberCount++;

    const wrapped =
      typeof observerOrNext === "function"
        ? {
            next: (value) => {
              connectable.nextCallCount++;
              observerOrNext(value);
            },
            error,
            complete,
          }
        : {
            next: (value) => {
              connectable.nextCallCount++;
              observerOrNext?.next?.(value);
            },
            error: (err) => observerOrNext?.error?.(err),
            complete: () => observerOrNext?.complete?.(),
          };

    const subscription = originalSubscribe(wrapped);
    const originalUnsubscribe = subscription.unsubscribe.bind(subscription);
    subscription.unsubscribe = () => {
      connectable.subscriberCount = Math.max(
        0,
        connectable.subscriberCount - 1,
      );
      return originalUnsubscribe();
    };
    return subscription;
  };

  return connectable;
}

/** Original scr01 scenario with counters (side-effect demo). */
export function runDemo() {
  function logCounts(label, subject, multicastSource) {
    console.log(
      `[${label}] subject: subscribers=${subject.subscriberCount}, nextCalls=${subject.nextCallCount}`,
    );
    console.log(
      `[${label}] multicastSource: subscribers=${multicastSource.subscriberCount}, nextCalls=${multicastSource.nextCallCount}`,
    );
  }

  const source = from([1, 2, 3, 4, 5]);
  const subject = trackSubject(new Subject());
  const multicastSource = trackConnectable(source.pipe(multicast(subject)));

  multicastSource.subscribe((value) => console.log("Subscriber 1:", value));
  multicastSource.subscribe((value) => console.log("Subscriber 2:", value));
  logCounts("after 2 subscribe", subject, multicastSource);

  subject.next(6);
  subject.next(7);
  logCounts("after subject.next(6/7)", subject, multicastSource);

  console.log("Connecting...");

  multicastSource.subscribe((value) => console.log("Subscriber 3:", value));
  logCounts("after 3rd subscribe", subject, multicastSource);

  multicastSource.connect();
  console.log("Connected");
  logCounts("after connect", subject, multicastSource);

  console.log("typeof multicastSource:", typeof multicastSource);
  console.log("multicastSource has connect?", typeof multicastSource.connect);

  return { source, subject, multicastSource };
}

// runDemo();
