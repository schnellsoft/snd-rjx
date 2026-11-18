//
import { interval, take, lastValueFrom, firstValueFrom } from "https://cdn.jsdelivr.net/npm/rxjs@7.8.1/+esm";

async function execute() {
  const source$ = interval(100).pipe(take(10));
  const finalNumber = await lastValueFrom(source$);
  const firstNumber = await firstValueFrom(source$);
  console.log(`The first number is ${firstNumber}`);
  console.log(`The final number is ${finalNumber}`);
}

execute();
console.log("Done");
// Expected output:
// "The first number is 0"
// "The final number is 9"