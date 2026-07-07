// shows the trace first -> second -> third (LIFO)
function third() {
  console.trace("third"); // shows trace of call stack
  // throw new Error("boom");
  console.log("Three");
}
function second() {
  third();
  console.log("two");
}
function first() {
  second();
  console.log("One");
}
first();

let x = 10;
function outer() {
  let y = 20;

  function inner() {
    console.log(x);
    console.log(y);
  }

  inner();
}
outer();

// Even with delay 0 secs 2 prints after 3
console.log("1: start");
setTimeout(() => console.log("2: timeout"), 0);
console.log("3: end");

// Recursion with base condition
function countdown(n) {
  if (n === 0) {
    console.log("Done");
    return;
  }

  console.log(n);
  countdown(n - 1);
}
console.log("Recurssion with base condition:");
countdown(5);

// shows Range error: Max callstack size exceeded
function recurse() {
  recurse();
}
recurse();
