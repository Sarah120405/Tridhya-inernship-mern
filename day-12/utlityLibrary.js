"use strict";
function swap(var1, var2) {
    return [var2, var1];
}
// Get First Array element
function getFirst(array) {
    return array[0];
}
// Get Last Array element
function getLast(array) {
    return array[array.length - 1];
}
// Reverse an array
function reverseArray(array) {
    return array.reverse();
}
// Filter takes a predicate function
function filter(arr, predicate) {
    return arr.filter(predicate);
}
// Takes array and transform function then returns new array of transformed items
function map(arr, transform) {
    return arr.map(transform);
}
// Returns first matching item or undefined
function find(arr, predicate) {
    return arr.find(predicate);
}
/* Groups array items by a specific key
keyof T constrains key to only valid keys of T
Returns Record<string, T[]> — object where keys are group names */
function groupBy(arr, key) {
    return arr.reduce((groups, item) => {
        const groupKey = String(item[key]);
        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(item);
        return groups;
    }, {});
}
// return unique values
function removeDuplicates(array) {
    const unique = [...new Set(array)];
    return unique;
}
// Sort array
var SortOrder;
(function (SortOrder) {
    SortOrder[SortOrder["Asc"] = 0] = "Asc";
    SortOrder[SortOrder["Desc"] = 1] = "Desc";
})(SortOrder || (SortOrder = {}));
function sortNumbers(numbers, order) {
    const num = numbers.sort();
    if (order === SortOrder.Asc) {
        return num;
    }
    else {
        const sorted = [...numbers].sort((a, b) => a - b);
        return sorted;
    }
}
// Create an API response
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["OK"] = 200] = "OK";
    HttpStatus[HttpStatus["Created"] = 201] = "Created";
    HttpStatus[HttpStatus["BadRequest"] = 400] = "BadRequest";
    HttpStatus[HttpStatus["NotFound"] = 404] = "NotFound";
    HttpStatus[HttpStatus["ServerError"] = 500] = "ServerError";
})(HttpStatus || (HttpStatus = {}));
// Factory function to create typed responses
function createResponse(data, status, message) {
    return {
        data,
        status,
        message,
        success: status === HttpStatus.OK || status === HttpStatus.Created,
    };
}
// Generic class of stack
class Stack {
    items = [];
    push(item) {
        this.items.push(item);
    }
    pop() {
        return this.items.pop();
    }
    peek() {
        return this.items[this.items.length - 1];
    }
    isEmpty() {
        return this.items.length === 0;
    }
    size() {
        return this.items.length;
    }
    toArray() {
        return [...this.items];
    }
}
const students = [
    { id: 1, name: "Sarah", age: 21, grade: 85, city: "Ahmedabad" },
    { id: 2, name: "John", age: 22, grade: 72, city: "Mumbai" },
    { id: 3, name: "Alice", age: 20, grade: 91, city: "Ahmedabad" },
    { id: 4, name: "Bob", age: 23, grade: 65, city: "Delhi" },
];
console.log("\nSwap: \n", swap(4, 7));
console.log("\nGet 1st Element: \n", getFirst([2, 5, 7, 3, 9]));
console.log("\nGet last Element: \n", getFirst([2, 5, 7, 3, 9]));
console.log("\nFilter");
console.log(filter(students, (s) => s.grade > 80));
console.log("\nMap");
console.log(map(students, (s) => s.name));
console.log("\nFind");
console.log(find(students, (s) => s.name === "Alice"));
console.log("\nGroup By");
console.log(groupBy(students, "city"));
console.log("\nRemove Duplicates");
console.log(removeDuplicates([1, 2, 2, 3, 3, 3, 4]));
console.log("\nSort By");
console.log(sortNumbers([2, 5, 1, 8, 3, 7], SortOrder.Desc));
console.log("\nApI Response");
console.log(createResponse(students, HttpStatus.OK, "Students fetched"));
console.log("\nStack class");
const stack = new Stack();
stack.push(1);
stack.push(2);
stack.push(3);
console.log("Peek:", stack.peek()); // 3
console.log("Pop:", stack.pop()); // 3
console.log("Size:", stack.size()); // 2
/*
// Test pick
console.log("\n=== pick ===")
console.log(pick(students[0], ["name", "grade"]))

// Test omit
console.log("\n=== omit ===")
console.log(omit(students[0], ["id"]))

// Test log
console.log("\n=== Logger ===")
log(LogLevel.Info, "App started")
log(LogLevel.Warn, "High memory usage", { usage: "85%" })
log(LogLevel.Error, "Student not found", { id: 99 })

// Test Queue
console.log("\n=== Queue ===")
const queue = new Queue<string>()
queue.enqueue("first")
queue.enqueue("second")
queue.enqueue("third")
console.log("Front:", queue.front())      // "first"
console.log("Dequeue:", queue.dequeue())  // "first"
console.log("Size:", queue.size())        // 2 */
