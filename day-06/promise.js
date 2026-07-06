function getData(dataId){

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("data: ", dataId);
            resolve(dataId);
        }, 5000)

    })
}

const promise = getData(123);
console.log(promise);
promise.then((res) => {console.log(`Succesfully fetched data of ${res}`);
})


// Promise Chaining to ensure once data 1 is fetched then only data 2 is fetched

console.log("Fetching data1....");
getData(1).then((res) => {
    console.log(`Succesfully fetched data of ${res}`)

    console.log("Fetching data2....");
    getData(2).then((res) => {
        console.log(`Succesfully fetched data of ${res}`)
    })
})

/* Output:
    Fetching data1....
    data: 1
    Succesfully fetched data of 1
    Fetching data2....
    data:  2
    Succesfully fetched data of 2
*/