//15
console.log("\n15: \n");

console.log(5 == "5") //Converted to number and compared true
console.log(5 === "5") //Compared without type conversion false
console.log(null == undefined)  //true special js rule
console.log(null === undefined) //with type check false
console.log(NaN == NaN) // false
console.log(0 == false) // true
console.log(0 === false) // false

//16
console.log("\n\n16: \n") // true
console.log(true && false) //false
console.log(true || false) //true
console.log(!true) //false
console.log("hello" && 42) //42 as && returns the last truthy value or first falsy value
console.log(null || "default") // "default" as || returns the first truthy value
console.log(0 ?? "fallback") // ?? (nullish coalescing) only triggers for null/undefined as 0 is NOT null or undefined returns 0
console.log(null ?? "fallback") // "fallback"

//17
console.log("\n\n17: \n") 
let age = 20
let result = age >= 18 ? "Adult" : "Minor"
console.log(result)

let score = 75
let grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F"
console.log(grade)

//18
console.log("\n\n18: \n")
let a = 5
let b = 10

a = a + b  // a = 15
b = a - b  // b = 15 - 10 = 5
a = a - b  // a = 15 - 5 = 10

console.log(a) // 10
console.log(b) // 5

//19
console.log("\n\n19: \n")
function fizzBuzz(n) {
    // write your solution here
    if (n%3 === 0 && n%5 === 0) return "FizzBuzz" 
    else if (n%5 === 0) return "Buzz" 
    else if (n%3 === 0 ) return "Fizz" 
    else return n    
}

console.log(fizzBuzz(3))   // "Fizz"
console.log(fizzBuzz(5))   // "Buzz"
console.log(fizzBuzz(15))  // "FizzBuzz"
console.log(fizzBuzz(7))   // 7
console.log(fizzBuzz(30))  // "FizzBuzz"