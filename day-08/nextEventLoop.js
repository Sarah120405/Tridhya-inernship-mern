/*
First nextTicks -> Promise -> Timers -> Intervals are resolved 
start -> end -> nt3 -> p3 -> p4 -> nt2 -> i2 -> p2 -> t1 -> nt1 -> p1 -> i1 -> t2 
*/

function nextEventLoop() {
  console.log("start");

  setTimeout(() => {
    console.log("t1");

    process.nextTick(() => console.log("nt1"));

    Promise.resolve().then(() => {
      console.log("p1");
      setImmediate(() => console.log("i1"));
    });

    setTimeout(() => console.log("t2"), 0);
  }, 0);

  setImmediate(() => {
    console.log("i2");
    Promise.resolve().then(() => console.log("p2"));
  });

  Promise.resolve().then(() => {
    console.log("p3");
    process.nextTick(() => console.log("nt2"));
  });

  process.nextTick(() => {
    console.log("nt3");
    Promise.resolve().then(() => console.log("p4"));
  });
  console.log("end");
}

function fetchInEventLoop() {
  console.log("Start");

  fetch("https://jsonplaceholder.typicode.com/users/1").then((res) => {
    console.log("Response Status: ", res.status);
    console.log("Fetched");
  });

  console.log("End");
}

setTimeout(() => {
  console.log("=== Example 1 ===");
  nextEventLoop();
}, 1000);

setTimeout(() => {
  console.log("=== Example 2 ===");
  fetchInEventLoop();
}, 2000);
