/* Event Loop Tracking-
    1. start runs immediatelly
    2. setTimout callback goes to callback queue
    3. Promise goes to microtasks queue
    4. end executes
    5. Promise executes 1st as microtasks are takes before callback
*/

function setTimeAndPromise() {
  console.log("Start");
  setTimeout(() => {
    console.log("setTimeout Callback");
  }, 0);
  Promise.resolve().then(() => {
    console.log("Promise Resolved");
  });
  console.log("End");
}

/* empty callback -> empty microtasks queue -> one callback queue -> empty microtasks queue -> callback queue
    start    
    end
    promise 1   microtasks queue
    promise 2   microtasks queue
    timeout 1   callback queue
    promise inside timeout    microtasks queue
    timeout 2   callback queue
 */

function PromiseNested() {
  console.log("start");

  setTimeout(() => {
    console.log("timeout 1");
    Promise.resolve().then(() => console.log("promise inside timeout"));
  }, 0);

  Promise.resolve()
    .then(() => {
      console.log("promise 1");
      return Promise.resolve();
    })
    .then(() => console.log("promise 2"));

  setTimeout(() => console.log("timeout 2"), 0);

  console.log("end");
}

/* queueMicrotask have same priority as promises
 */
function queueMicrotaskExecution() {
  console.log("A");

  Promise.resolve().then(() => {
    console.log("B");

    Promise.resolve().then(() => {
      console.log("C");
    });

    queueMicrotask(() => {
      console.log("D");
    });

    console.log("E");
  });

  queueMicrotask(() => {
    console.log("F");

    Promise.resolve().then(() => {
      console.log("G");
    });
  });

  setTimeout(() => {
    console.log("H");
  }, 0);
  console.log("I");
}

/* Output: 
  start
  1
  end
  2
*/
function asyncAwaitExample() {
  async function demo() {
    console.log("1");

    await Promise.resolve();

    console.log("2");
  }

  console.log("Start");
  demo();
  console.log("End");
}

/* Output: 
    start
    End
    Timeout
*/
function blockingCode() {
  console.log("Start");

  setTimeout(() => console.log("Timeout"), 0);

  for (let i = 0; i < 1e9; i++) {}

  console.log("End");
}

setTimeout(() => {
  console.log("=== Example 1 ===");
  setTimeAndPromise();
}, 1000);

setTimeout(() => {
  console.log("=== Example 2 ===");
  PromiseNested();
}, 2000);

setTimeout(() => {
  console.log("=== Example 3 ===");
  queueMicrotaskExecution();
}, 3000);

setTimeout(() => {
  console.log("=== Example 4 ===");
  asyncAwaitExample();
}, 4000);

console.log("=== Example 5 ===");
blockingCode();
