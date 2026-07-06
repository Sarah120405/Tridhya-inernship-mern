// Synchronous callbacks using array methods
const numbers = [1, 2, 3, 4, 5]

const doubled = numbers.map(num => num * 2)
const evens = numbers.filter(num => num % 2 === 0)

/* Asyn callback is being created with a delay of 2s so three will be printed before Hello*/
console.log("One");
console.log("Two");

setTimeout(() => {
    console.log("Hello");
}, 2000)

console.log("Three");
/* Output: 
    One
    Two
    Three
    Hello
*/


// This function is stimulating an api response where next response is generated only after completion of previous response
function getData(dataId, getNextData){

    setTimeout(() => {
        console.log("data: ", dataId);
        if(getNextData){
            getNextData()
        }
    }, 2000)
}

// Callback hell is being created as data is being passed in nested structure
getData(1, () => {
    console.log("Getting data 2.....");
    getData(2, () => {
        console.log("Getting data 3.....");
        getData(3)
    });
})