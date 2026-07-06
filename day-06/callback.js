/* Asyn callback is being created. As setTimout is adding a delay of 2s 
    due to async callback next line 3 will be printed and later Hello will be printed 
*/
console.log("One");
console.log("Two");

setTimeout(() => {
    console.log("Hell0");
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