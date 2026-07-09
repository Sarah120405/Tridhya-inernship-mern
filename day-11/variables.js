"use strict";
/* let name = "Sarah";
let age = 21;
 */
//1
// TypeScript — same code with types
let age = 21;
let userName = "Sarah";
console.log(`${userName} is ${age} years old`);
// userName = 2; Type error if different type is assigned
console.log(userName);
//2
console.log("\n\n2:\n");
let random = "hello";
console.log("Variable with type any: ", random);
random = 43;
console.log("Variable is assigned value of differnt type:", random);
//3
console.log("\n\n3:\n");
// Unknown — safer version of any
let input = "hello";
// Must check type before using
// console.log(input.toUpperCase());
if (typeof input === "string") {
    console.log(input.toUpperCase()); // OK
}
//4
console.log("\n\n4:\n");
// Array — two syntaxes, same result
let numbers = [1, 2, 3, 4, 5];
let names = ["Sarah", "John", "Alice"];
console.log("Array type num:", numbers, "\nArray type string: ", names);
// Mixed arrays use union type
let mixed = ["hello", "world", 42, 1];
console.log("Mixed type array: ", mixed);
// Tuple — fixed length, fixed types at each position person[0] is always string person[1] is always number
let person = ["Sarah", 21];
console.log("tuple with fixed length: ", person);
//5
console.log("\n\n5:\n");
const carType = "Toyota";
const carModel = "Corolla";
const car = {
    year: 2001,
    type: carType,
    model: carModel,
};
console.log("Variable of type Car", car);
//6
console.log('\n\n6"\n');
// Same usage as type alias for objects
const student = {
    name: "Sarah",
    age: 21,
    grade: "A",
    isActive: true,
    getInfo() {
        return `Student ${this.name} of age ${this.age} have grade of ${this.grade}`;
    },
};
//7
console.log('\n\n7"\n');
//Union - or
let id = "String";
console.log("ID with type string | number: ", id);
id = 45;
console.log(id);
const p = {
    name: "Sarah",
    age: 21,
};
console.log("Type intersection of string and number", p);
//8
// Typed parameters and return type
function add(a, b) {
    return a + b;
}
console.log("Function with return type number: ", add(4, 5));
// Optional parameter
function greet(name, title) {
    return title ? `Hello ${title} ${name}` : `Hello ${name}`;
}
console.log(greet("Sarah")); // "Hello Sarah"
console.log(greet("Sarah", "Dr.")); // "Hello Dr. Sarah"
// Rest parameters
function sum(...numbers) {
    return numbers.reduce((acc, n) => acc + n, 0);
}
console.log("Sum using rest parameters: ", sum(1, 2, 3, 4, 5));
