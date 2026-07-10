function swap<T, U>(var1: T, var2: U): [U, T] {
  return [var2, var1];
}

// Get First Array element
function getFirst<T>(array: T[]): T {
  return array[0];
}

// Get Last Array element
function getLast<T>(array: T[]): T {
  return array[array.length - 1];
}

// Reverse an array
function reverseArray<T>(array: T[]): T[] {
  return array.reverse();
}
// Filter takes a predicate function
function filter<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}

// Takes array and transform function then returns new array of transformed items
function map<T, U>(arr: T[], transform: (item: T) => U): U[] {
  return arr.map(transform);
}

// Returns first matching item or undefined
function find<T>(arr: T[], predicate: (item: T) => boolean): T | undefined {
  return arr.find(predicate);
}

/* Groups array items by a specific key
keyof T constrains key to only valid keys of T
Returns Record<string, T[]> — object where keys are group names */
function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce(
    (groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    },
    {} as Record<string, T[]>,
  );
}

// return unique values
function removeDuplicates<T>(array: T[]): T[] {
  const unique = [...new Set(array)];
  return unique;
}

// Sort array
enum SortOrder {
  "Asc",
  "Desc",
}

function sortNumbers(numbers: number[], order: SortOrder) {
  const num: number[] = numbers.sort();
  if (order === SortOrder.Asc) {
    return num;
  } else {
    const sorted = [...numbers].sort((a, b) => a - b);
    return sorted;
  }
}
// Used Pick Utility to get name and grade of a student
type PickGrade = Pick<Student, "name" | "grade">;
function StudentGrade(student: Student) {
  const studentGrade: PickGrade = {
    grade: student.grade,
    name: student.name,
  };

  return {
    Grade: studentGrade.grade,
    Name: studentGrade.name,
  };
}

// Return data without Id of student using Omit
type StudentWithoutId = Omit<Student, "id">;
function summary(student: Student) {
  const summary: StudentWithoutId = {
    name: student.name,
    age: student.age,
    grade: student.grade,
    city: student.city,
  };
  return summary;
}

// Merge Objects
function mergeObjects<T extends object, U extends object>(
  obj1: T,
  obj2: U,
): T & U {
  return {
    ...obj1,
    ...obj2,
  };
}
// Create an API response

enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  NotFound = 404,
  ServerError = 500,
}
// Generic interface for API responses
interface ApiResponse<T> {
  data: T;
  status: HttpStatus;
  message: string;
  success: boolean;
}

// Factory function to create typed responses
function createResponse<T>(
  data: T,
  status: HttpStatus,
  message: string,
): ApiResponse<T> {
  return {
    data,
    status,
    message,
    success: status === HttpStatus.OK || status === HttpStatus.Created,
  };
}

// Generic class of stack
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  toArray(): T[] {
    return [...this.items];
  }
}
// Test data
interface Student {
  id: number;
  name: string;
  age: number;
  grade: number;
  city: string;
}

const students: Student[] = [
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
console.log(
  "Merged Name and Birthday Object\n",
  mergeObjects({ name: "Sarah" }, { birthday: "12/04/2005" }),
);

console.log("\nApI Response");
console.log(createResponse(students, HttpStatus.OK, "Students fetched"));

console.log("\nStack class");

const stack = new Stack<number>();
stack.push(1);
stack.push(2);
stack.push(3);
console.log("Peek:", stack.peek()); // 3
console.log("Pop:", stack.pop()); // 3
console.log("Size:", stack.size()); // 2
