/* Generics allow to write code that works with any type while maintaining type safety
  It can be applied on functions, interface, class, constuctors
*/
// Simple generic function
function identity<T>(value: T): T {
  return value;
}
const result1 = identity<string>("hello"); // result1: string
const result2 = identity<number>(42);
console.log("Generic Function", result1, result2);
console.log();

// Multiple type parameters
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

console.log(
  "Multiple type Parameter Function: ",
  pair<string, number>("Sarah", 21),
); // [string, number]
console.log();

// Generic Function with array methods
function filter<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}

const fil1 = filter<number>([1, 2, 3, 4, 5], (n) => n > 3); // [4, 5]
const fil2 = filter<string>(["a", "bb", "ccc"], (s) => s.length > 1); // ["bb", "ccc"]
console.log("Generic with array methods", fil1, fil2);
console.log();

// Generic Interface
interface Box<T> {
  value: T;
  getValue(): T;
}

const numberBox: Box<number> = {
  value: 42,
  getValue() {
    return this.value;
  },
};

const stringBox: Box<string> = {
  value: "hello",
  getValue() {
    return this.value;
  },
};

console.log(
  "Generic Interface:\nNumber: ",
  numberBox.value,
  "\nString: ",
  stringBox.value,
);
console.log();

interface Student {
  id: number;
  name: string;
  age: number;
  grade: string;
  isActive: boolean;
}

// Built in generics

type PartialStudent = Partial<Student>; //Partial<T> — makes all properties optional { id?: number; name?: string; age?: number; ... }

const update: Partial<Student> = { name: "Sarah" }; // only name
console.log("Made name optional using Partial: ", update);
console.log();

type RequiredStudent = Required<PartialStudent>; // Required<T> — makes all properties required

type ReadonlyStudent = Readonly<Student>; // Readonly<T> — makes all properties readonly
let s: ReadonlyStudent = {
  id: 1,
  name: "Sarah",
  age: 21,
  grade: "A",
  isActive: true,
};
// s.name = "Aman"  // Error as readonly
console.log("Readonly property applied: ", s);
console.log();

type StudentPreview = Pick<Student, "id" | "name">; // Pick<T, K> — pick specific properties
let StudentPick: StudentPreview = {
  id: 2,
  name: "Sarah",
  // age: 12 Error as only id and name were picked
};
console.log("Picking only id and name of Student: ", StudentPick);
console.log();

type StudentWithoutId = Omit<Student, "id">; // Omit<T, K> — omit specific properties
const StudentOmit: StudentWithoutId = {
  // id: 3 shows error since omited
  name: "Alice",
  age: 23,
  grade: "B",
  isActive: false,
};
console.log("Student data omiting id: ", StudentOmit);
console.log();

// Record<K, V> — creates object type with keys K and values V
type RolePermissions = Record<string, boolean>;
const permissions: RolePermissions = {
  canRead: true,
  canWrite: false,
  canDelete: false,
};
