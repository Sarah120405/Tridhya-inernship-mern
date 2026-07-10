//Discriminated Union
type LoadingState = { status: "loading" };
type SuccessState = { status: "success"; data: string[] };
type ErrorState = { status: "error"; message: string };

type FetchState = LoadingState | SuccessState | ErrorState;

function render(state: FetchState): string {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return `Got ${state.data.length} items`;
    case "error":
      return `Error: ${state.message}`;
    default: {
      const exhaustiveCheck: never = state;
      return exhaustiveCheck;
    }
  }
}
console.log("Discriminated Union");
console.log(render({ status: "loading" }));
console.log(render({ status: "success", data: ["a", "b"] }));
console.log(render({ status: "error", message: "Network failed" }));

interface Student {
  rollNumber: number;
  submitAssignment(): string;
}

interface Teacher {
  employeeId: number;
  gradeAssignment(): string;
}

// Custom Predicate
function isStudent(person: Student | Teacher): person is Student {
  return (person as Student).submitAssignment !== undefined; // check if is student based on submitAssigment() if not return false
}

function handlePerson(person: Student | Teacher): string {
  if (isStudent(person)) {
    return person.submitAssignment();
  }
  return person.gradeAssignment();
}

const student: Student = {
  rollNumber: 123,
  submitAssignment() {
    return "Assignment complete";
  },
};

console.log(
  "\nCustom Predicate To check if object is of interface Student:\n",
  handlePerson(student),
);

interface Animal {
  sound: string;
}
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

const animal: MyReadonly<Animal> = { sound: "bark" };
// s.name = "Alice"; // Error — readonly
console.log("\nMade Animal interface readonly: ", animal);

//conditional Types
type ExtractStrings<T> = T extends string ? T : never;

type Mixed = "a" | 1 | "b" | 2 | true;
type OnlyStrings = ExtractStrings<Mixed>; // "a" | "b"

let str: OnlyStrings;
str = "a";
// str = "c";
console.log("\nApplied Conditional Types: to accept a and b", str);

const defaultConfig = { timeout: 5000, retries: 3 };
type Config = typeof defaultConfig;
type ConfigKey = keyof Config; // "timeout" | "retries"
let c: Config = {
  timeout: 822,
  retries: 4,
};

const key: ConfigKey = "timeout"; // valid — try "invalid" and see it error
console.log(
  "\nExtracted types structure from existing type and created new: ",
  c,
);

// Conditional Type using infer
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getStudentName(): string {
  return "Sarah";
}
type NameType = MyReturnType<typeof getStudentName>; // string
const userName: NameType = "Sarah"; // should only accept a string
console.log(
  "\nConditional Type using infer to accept string: ",
  typeof userName,
);

type MixedType = string | number | boolean;

// Exclude and Extract utility types
type WithoutString = Exclude<MixedType, string>;
const noStr: WithoutString = 5;
//const No: WithoutString = "Hello";
console.log("\nExclude to remove string type: ", noStr);

type OnlyString = Extract<MixedType, string>;
const onlyStr: OnlyString = "hello";
//const Str : OnlyString = 5;
console.log("Extract to only take string type: ", onlyStr);

// NoNullable utility to ensure null values can not be assigned
type User = string | null | undefined;
type ValidUser = NonNullable<User>;
const validUser: ValidUser = "Sarah";
// const user: ValidUser = null;
console.log("\nNon null values accepted: ", validUser);

function greet(name: string, age: number) {
  return `Name: ${name}\nAge: ${age}`;
}

// Ensure parameters are created in required order
type Params = Parameters<typeof greet>;
const args: Params = ["Sarah", 21];
//const arg: Params = [21, "Sarah"];
console.log(
  "\nParameters Type to accept particular typer of parameters",
  greet(...args),
);

// Template literal type
type Direction = "left" | "right";
type MoveEvent = `move-${Direction}`;
const evt: MoveEvent = "move-left";
// const evt: MoveEvent = "move-up";
console.log("\nTempelate literal to accpet move-left or move-right: ", evt);

// Awaited to ge other type returned rather than a promise from async function
async function getName() {
  return "Sarah";
}
type PromiseType = ReturnType<typeof getName>;
type AwaitedType = Awaited<PromiseType>;

const n: AwaitedType = "Sarah";
// const name: NameType = 123; Error

console.log(
  "\nMade Async function return actual output rather than a promise: ",
  n,
);
