/* let name = "Sarah";
let age = 21;
 */
//1
// TypeScript — same code with types
let age: number = 21;
let userName: string = "Sarah";

console.log(`${userName} is ${age} years old`);

// userName = 2; Type error if different type is assigned
console.log(userName);

//2
console.log("\n\n2:\n");
let random: any = "hello";
console.log("Variable with type any: ", random);
random = 43;
console.log("Variable is assigned value of differnt type:", random);

//3
console.log("\n\n3:\n");
// Unknown — safer version of any
let input: unknown = "hello";
// Must check type before using
// console.log(input.toUpperCase());
if (typeof input === "string") {
  console.log(input.toUpperCase()); // OK
}

//4
console.log("\n\n4:\n");
// Array — two syntaxes, same result
let numbers: number[] = [1, 2, 3, 4, 5];
let names: Array<string> = ["Sarah", "John", "Alice"];
console.log("Array type num:", numbers, "\nArray type string: ", names);

// Mixed arrays use union type
let mixed: (string | number)[] = ["hello", "world", 42, 1];
console.log("Mixed type array: ", mixed);

// Tuple — fixed length, fixed types at each position person[0] is always string person[1] is always number
let person: [string, number] = ["Sarah", 21];
console.log("tuple with fixed length: ", person);

//5
console.log("\n\n5:\n");
type CarYear = number;
type CarType = string;
type CarModel = string;
type Car = {
  year: CarYear;
  type: CarType;
  model: CarModel;
};
const carType: CarType = "Toyota";
const carModel: CarModel = "Corolla";
const car: Car = {
  year: 2001,
  type: carType,
  model: carModel,
};

console.log("Variable of type Car", car);

//6
console.log('\n\n6"\n');
// Interface — defines the shape of an object
interface Student {
  name: string;
  age: number;
  grade: string;
  isActive: boolean;
  phone?: number;
  getInfo(): string;
}

// Same usage as type alias for objects
const student: Student = {
  name: "Sarah",
  age: 21,
  grade: "A",
  isActive: true,
  getInfo() {
    return `Student ${this.name} of age ${this.age} have grade of ${this.grade}`;
  },
};
console.log(student.getInfo());
student.phone = 1234567899;
console.log("Students optional property phone added: ", student);

//7
console.log('\n\n7"\n');

//Union - or
let id: string | number = "String";
console.log("ID with type string | number: ", id);
id = 45;
console.log(id);

// Intersection - and
type Person = { name: string } & { age: number }; // must have both name and age

const p: Person = {
  name: "Sarah",
  age: 21,
};
console.log("Type intersection of string and number", p);

//8
// Typed parameters and return type
function add(a: number, b: number): number {
  return a + b;
}
console.log("Function with return type number: ", add(4, 5));

// Optional parameter
function greet(name: string, title?: string): string {
  return title ? `Hello ${title} ${name}` : `Hello ${name}`;
}
console.log(greet("Sarah")); // "Hello Sarah"
console.log(greet("Sarah", "Dr.")); // "Hello Dr. Sarah"

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}
console.log("Sum using rest parameters: ", sum(1, 2, 3, 4, 5));
