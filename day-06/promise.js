function getData(dataId){

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("data: ", dataId);
            resolve(dataId);
        }, 2000)

    })
}

const promise = getData(123);
console.log(promise);
promise
    .then((res) => {console.log(`Succesfully fetched data of ${res}`); })
    .finally(() => {console.log(`Loading completed`)})

// Promise Chaining to ensure once data 1 is fetched then only data 2 is fetched

setTimeout(() => {
    console.log("Fetching data1....");
    getData(1).then((res) => {
        console.log(`Succesfully fetched data of ${res}`)

        console.log("Fetching data2....");
        getData(2).then((res) => {
            console.log(`Succesfully fetched data of ${res}`)
            
            console.log("Fetching data3....");
            getData(3).then((res) => {
                return console.log(`Succesfully fetched data of ${res}`)
            })
        })
    })
}, 3000)

/* Output:
    Fetching data1....
    data: 1
    Succesfully fetched data of 1
    Fetching data2....
    data:  2
    Succesfully fetched data of 2
*/

// Demonsration of promise.race - as slow is taking 1500ms more than fast it will be ignored
setTimeout(() => {
    const fast = new Promise(resolve => setTimeout(() => resolve("fast"), 500))
    const slow = new Promise(resolve => setTimeout(() => resolve("slow"), 2000))

    Promise.race([fast, slow])
        .then(result => console.log(result))  // fast
}, 9000)