function createCounter() {
    let count = 0
    return {
        increment() { 
            return ++count 
        },
        decrement() { 
            return --count 
        },
        reset() { 
            count = 0; 
            return count 
        },
        getCount() {  // getCount method creates a reference of count and keep it alive even when outer function has completed
            return count }
    }
}

const counter = createCounter() // because of refrence count keeps incrementing 
console.log(counter.increment());
console.log(counter.increment());
console.log(counter.increment());

console.log(counter.decrement());
console.log(counter.decrement());
console.log(counter.decrement());

console.log(counter.reset());