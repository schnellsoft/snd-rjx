/**
 * RxJS operators demo — MULTICAST / SHARE
 * share, shareReplay, multicast, publish, publishBehavior, publishReplay, publishLast, refCount, connect
 */
import {
  of,
  interval,
  Subject,
  BehaviorSubject,
  ReplaySubject,
  AsyncSubject,
  tap,
  take,
  share,
  shareReplay,
  multicast,
  publish,
  publishBehavior,
  publishReplay,
  publishLast,
  refCount,
  map,
} from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

export function runDemo() {
  console.log("========== MULTICAST / SHARE OPERATORS ==========");

  // --- share: multicast + refCount-like (one source execution for many subscribers) ---
  console.log("--- share ---");
  const shared$ = of(1, 2, 3).pipe(
    tap((v) => console.log("share produced:", v)),
    share(),
  );
  shared$.subscribe((v) => console.log("share A:", v));
  // sync complete source: second subscriber may get nothing / restart depending on config
  shared$.subscribe((v) => console.log("share B:", v));

  // --- shareReplay: cache last N for late subscribers ---
  console.log("--- shareReplay ---");
  const replayed$ = of("cached").pipe(
    tap((v) => console.log("shareReplay produced:", v)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  replayed$.subscribe((v) => console.log("shareReplay A:", v));
  replayed$.subscribe((v) => console.log("shareReplay B (late):", v));

  // --- multicast + connect (ConnectableObservable) ---
  console.log("--- multicast + connect ---");
  const hub = new Subject();
  const multi$ = of(10, 20).pipe(
    tap((v) => console.log("multicast source:", v)),
    multicast(hub),
  );
  multi$.subscribe((v) => console.log("multi A:", v));
  multi$.subscribe((v) => console.log("multi B:", v));
  multi$.connect(); // start shared source

  // --- multicast + refCount: auto connect/disconnect ---
  console.log("--- multicast + refCount ---");
  const auto$ = of(1).pipe(
    tap((v) => console.log("refCount source:", v)),
    multicast(() => new Subject()),
    refCount(),
  );
  auto$.subscribe((v) => console.log("refCount sub:", v));

  // --- publish* sugar ---
  console.log("--- publish / publishBehavior / publishReplay / publishLast ---");
  // publish() ~= multicast(new Subject())
  const pub$ = of("p").pipe(publish());
  pub$.subscribe((v) => console.log("publish:", v));
  pub$.connect();

  const pb$ = of("b").pipe(publishBehavior("seed"));
  pb$.subscribe((v) => console.log("publishBehavior:", v)); // seed then b
  pb$.connect();

  const pr$ = of(1, 2, 3).pipe(publishReplay(1));
  pr$.connect();
  pr$.subscribe((v) => console.log("publishReplay late:", v)); // last value 3

  const pl$ = of(1, 2, 3).pipe(publishLast());
  pl$.subscribe((v) => console.log("publishLast:", v)); // 3 after complete
  pl$.connect();
}

window.runDemo = runDemo;
runDemo();
