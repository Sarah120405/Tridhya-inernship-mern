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
function StudentGrade(student) {
    const studentGrade = {
        grade: student.grade,
        name: student.name,
    };
    return {
        Grade: studentGrade.grade,
        Name: studentGrade.name,
    };
}
function summary(student) {
    const summary = {
        name: student.name,
        age: student.age,
        grade: student.grade,
        city: student.city,
    };
    return summary;
}
// Merge Objects
function mergeObjects(obj1, obj2) {
    return {
        ...obj1,
        ...obj2,
    };
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
console.log("\nReverse");
console.log("Actual Array: [1,2,3,4,5]");
console.log("Reversed Array: ", reverseArray([1, 2, 3, 4, 5]));
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
console.log("Unsorted Array: [2, 5, 1, 8, 3, 7]");
console.log("Sorted Array: ", sortNumbers([2, 5, 1, 8, 3, 7], SortOrder.Desc));
console.log("\nPick Grade: ");
console.log(StudentGrade(students[0]));
console.log("\nOmit id: ");
console.log(summary(students[0]));
console.log("\nMerge Objects");
console.log("Merged Name and Birthday Object\n", mergeObjects({ name: "Sarah" }, { birthday: "12/04/2005" }));
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
