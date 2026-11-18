import { Subject, interval, multicast } from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";
//import { test, expect } from "../../libs/test.js";

//test("multicast", () => {
  const src = interval(1000);
  const subject = new Subject();
  const multicastSource = src.pipe(multicast(subject));
  multicastSource.subscribe((x) => console.log("A", x));
  multicastSource.subscribe((x) => console.log("B", x));
  setTimeout(() => {
    multicastSource.subscribe((x) => console.log("C", x));
  }, 3000);
//});
//src.subscribe((x) => console.log("D", x));
multicastSource.connect();
