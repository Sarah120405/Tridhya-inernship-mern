/* Data Types are of 2 types:
    Primitive & Non- primitive
    Primitive include string, numbers, boolean, undefined, null, BigInt, Symbol
    Non -primitive include objects, arrays, functions
*/
//7
console.log("\n7: \n");
console.log(typeof null) //object as it is an object whose value is currently null
console.log(typeof undefined) // undefined
console.log(typeof NaN) // number as it is a number but not a valid number
console.log(typeof [1, 2, 3]) // object as array is a type of object
console.log(typeof function(){}) // function as it is a function


//8
console.log("\n\n8: \n");
function checkType(value) {
        if (Array.isArray(value)) {
            return "array";
        }
        if (value === null) {
            return "null";
        }
        return typeof value;
}

console.log(checkType([1,2,3]))  // "array"
console.log(checkType(null))     // "null"
console.log(checkType(42))       // "number"
console.log(checkType("hello"))  // "string"
console.log(checkType(true))     // "boolean"

//9
console.log("\n\n9: \n");
const obj1 = { name: "Sarah" }
const obj2 = { name: "Sarah" }
const obj3 = obj1

console.log(obj1 == obj2) // false as they are different objects in memory
console.log(obj1 === obj2) // false as they are different objects in memory
console.log(obj1 === obj3) // true as they are same object in memory
console.log(obj1.name === obj2.name) // true as they are same string value in memory

obj3.name = "John"
console.log(obj1.name) // "John" as obj3 and obj1 are same object in memory so change in obj3 reflects in obj1

//10
console.log("\n\n10: \n");
let p = 5
let q = p
q = 10
console.log(p)  // 5 — primitives copy by value
console.log(q)  // 10

let objA = { x: 5 }
let objB = objA
objB.x = 10
console.log(objA.x)  // 10 — objects copy by reference
console.log(objB.x)  // 10