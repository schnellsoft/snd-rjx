import { from, Subject, multicast } from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

const source = from([1, 2, 3, 4, 5]);
const subject = new Subject();
const multicastSource = source.pipe(multicast(subject));

multicastSource.subscribe((value) => console.log("Subscriber 1:", value));
multicastSource.subscribe((value) => console.log("Subscriber 2:", value));

subject.next(6);
subject.next(7);

console.log("Connecting...");

multicastSource.subscribe((value) => console.log("Subscriber 3:", value));
multicastSource.connect();
console.log("Connected");

console.log(typeof multicastSource); // should be a function