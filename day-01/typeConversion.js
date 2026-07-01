//11
console.log("\n\n11: \n");
console.log(10 + "5") //Converted to string and concatenated 105
console.log(10 - "5") //Converted to number and subtracted 5
console.log(10 * "5") //Converted to number and multiplied 50
console.log(10 / "0") //Returns Infinity
console.log(10 % 3) //Returns 1
console.log(2 ** 10) //Returns 1024

//12
console.log("\n\n12: \n");
console.log(+"42")        // 42
console.log(+true)        // 1
console.log(+false)       // 0
console.log(+null)        // 0
console.log(+undefined)   // NaN
console.log(+"")          // 0

//13
console.log("\n\n13: \n");
console.log(Number("42")) // converted to number 42
console.log(Number("")) // converted to number 0
console.log(Number("abc")) // converted to number NaN
console.log(Number(true)) // converted to number 1
console.log(Number(null)) // converted to number 0
console.log(Number(undefined)) // converted to number NaN
console.log(parseInt("42px")) // converted to number 42
console.log(parseFloat("3.14abc")) // converted to number 3.14

//14
console.log("\n\n14: \n");
console.log(1 < 2 < 3)   // true  
console.log(3 > 2 > 1)   // false as left to right evaluation

