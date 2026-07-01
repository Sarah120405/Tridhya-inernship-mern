/* Container that tells the memory location where value is stored
    Rules: 
    1. Case Sensitive
    2. Only alphnumeric characters, underscore and $ is allowed
    3. Digits can not be 1st characters
    4. Reserved words can not be variables 
*/

/* Variable declaration:
    var- global scope, can be re-declared and updated hence not used anymore
    let - Introduced in ECM6 block scoped, can't be re-declared and can be updated
    const - block level scoped. can't be re-declared and updated
*/

//1
console.log("\n\n1: \n")
const arr = [1, 2, 3]
arr.push(4)
console.log(arr) // [1,2,3,4] as array is mutable

const num = 5
// num = 10
console.log(num) // error as const can not be re-assigned

//2
console.log("\n\n2: \n")
var x = 1
let y = 2
const z = 3

{
    var x = 10
    let y = 20
    const z = 30
    console.log(x, y, z) // 10 20 30 as var is function scoped and let and const are block scoped
}

console.log(x, y, z) // 10 2 3 as var is re assigned and let and const are block scoped

//3
console.log("\n\n3: \n")
const product = {
    name: "Ball Pen",
    rating: 4,
    offer: 5,
    price: 20
}

console.log(product);
console.log(product.name);

//4
console.log("\n\n4: \n")
let ad = 1

function outer() {
    let ad = 2
    
    function inner() {
        let ad = 3
        console.log(ad) // 3 as inner function has access to its own scope
    }
    
    inner()
    console.log(ad) // 2 as outer function has access to its own scope
}

outer()
console.log(ad) // 1 as global scope has access to its own scope

//5
console.log("\n\n5: \n")
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i)
    }, 1000)
} // 3 3 3 as var is function scoped and the loop has already completed when the timeout is executed

for (let j = 0; j < 3; j++) {
    setTimeout(function() {
        console.log(j)
    }, 1000)
} // 0 1 2 as let is block scoped and each iteration has its own scope

//6
console.log("\n\n6: \n")
function foo() {
    console.log(a)   // undefined as var is hoisted to the top of the function scope
    console.log(b)   // ReferenceError as let is hoisted but NOT initialised
    var a = 1
    let b = 2
}
foo()

