"use strict";
function render(state) {
    switch (state.status) {
        case "loading":
            return "Loading...";
        case "success":
            return `Got ${state.data.length} items`;
        case "error":
            return `Error: ${state.message}`;
        default: {
            const exhaustiveCheck = state;
            return exhaustiveCheck;
        }
    }
}
console.log("Discriminated Union");
console.log(render({ status: "loading" }));
console.log(render({ status: "success", data: ["a", "b"] }));
console.log(render({ status: "error", message: "Network failed" }));
// Custom Predicate
function isStudent(person) {
    return person.submitAssignment !== undefined; // check if is student based on submitAssigment() if not return false
}
function handlePerson(person) {
    if (isStudent(person)) {
        return person.submitAssignment();
    }
    return person.gradeAssignment();
}
const student = {
    rollNumber: 123,
    submitAssignment() {
        return "Assignment complete";
    },
};
console.log("\nCustom Predicate To check if object is of interface Student:\n", handlePerson(student));
const animal = { sound: "bark" };
// s.name = "Alice"; // Error — readonly
console.log("\nMade Animal interface readonly: ", animal);
let str;
str = "a";
// str = "c";
console.log("\nApplied Conditional Types: to accept a and b", str);
const defaultConfig = { timeout: 5000, retries: 3 };
let c = {
    timeout: 822,
    retries: 4,
};
const key = "timeout"; // valid — try "invalid" and see it error
console.log("\nExtracted types structure from existing type and created new: ", c);
function getStudentName() {
    return "Sarah";
}
const userName = "Sarah"; // should only accept a string
console.log("\nConditional Type using infer to accept string: ", typeof userName);
const noStr = 5;
//const No: WithoutString = "Hello";
console.log("\nExclude to remove string type: ", noStr);
const onlyStr = "hello";
//const Str : OnlyString = 5;
console.log("Extract to only take string type: ", onlyStr);
const validUser = "Sarah";
// const user: ValidUser = null;
console.log("\nNon null values accepted: ", validUser);
function greet(name, age) {
    return `Name: ${name}\nAge: ${age}`;
}
const args = ["Sarah", 21];
//const arg: Params = [21, "Sarah"];
console.log("\nParameters Type to accept particular typer of parameters", greet(...args));
const evt = "move-left";
// const evt: MoveEvent = "move-up";
console.log("\nTempelate literal to accpet move-left or move-right: ", evt);
// Awaited to ge other type returned rather than a promise from async function
async function getName() {
    return "Sarah";
}
const n = "Sarah";
// const name: NameType = 123; Error
console.log("\nMade Async function return actual output rather than a promise: ", n);
