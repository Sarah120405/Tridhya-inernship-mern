"use strict";
// Generics allow to write code that works with any type while maintaining type safety
// Simple generic function
function identity(value) {
    return value;
}
const result1 = identity("hello"); // result1: string
const result2 = identity(42);
console.log("Generic Function", result1, result2);
console.log();
// Multiple type parameters
function pair(first, second) {
    return [first, second];
}
console.log("Multiple type Parameter Function: ", pair("Sarah", 21)); // [string, number]
console.log();
// Generic Function with array methods
function filter(arr, predicate) {
    return arr.filter(predicate);
}
const fil1 = filter([1, 2, 3, 4, 5], (n) => n > 3); // [4, 5]
const fil2 = filter(["a", "bb", "ccc"], (s) => s.length > 1); // ["bb", "ccc"]
console.log("Generic with array methods", fil1, fil2);
console.log();
const numberBox = {
    value: 42,
    getValue() {
        return this.value;
    },
};
const stringBox = {
    value: "hello",
    getValue() {
        return this.value;
    },
};
console.log("Generic Interface:\nNumber: ", numberBox.value, "\nString: ", stringBox.value);
console.log();
const update = { name: "Sarah" }; // only name
console.log("Made name optional using Partial: ", update);
console.log();
let s = {
    id: 1,
    name: "Sarah",
    age: 21,
    grade: "A",
    isActive: true,
};
// s.name = "Aman"  // Error as readonly
console.log("Readonly property applied: ", s);
console.log();
let StudentPick = {
    id: 2,
    name: "Sarah",
    // age: 12 Error as only id and name were picked
};
console.log("Picking only id and name of Student: ", StudentPick);
console.log();
const StudentOmit = {
    // id: 3 shows error since omited
    name: "Alice",
    age: 23,
    grade: "B",
    isActive: false,
};
console.log("Student data omiting id: ", StudentOmit);
console.log();
const permissions = {
    canRead: true,
    canWrite: false,
    canDelete: false,
};
