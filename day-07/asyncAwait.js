async function greeting(a) {
    return a;
}

console.log(greeting("Hello"));


function getData(dataId){

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("data: ", dataId);
            resolve(dataId);
        }, 2000)

    })
}

await getData(1)
await getData(2)
await getData(3)


async function fetchAll() {
    try {
        // Run all three simultaneously
        const [user, posts, todos] = await Promise.all([
            fetch("https://jsonplaceholder.typicode.com/users/1")
                .then(r => r.json()),
            fetch("https://jsonplaceholder.typicode.com/posts?userId=1")
                .then(r => r.json()),
            fetch("https://jsonplaceholder.typicode.com/todos?userId=1")
                .then(r => r.json())
        ])
        
        console.log(user)
        console.log(posts.length)
        console.log(todos.length)
        
    } catch(err) {
        console.log(err)
    }
}

fetchAll()
