/* Here I am applyng cache in three ways:
    1. Basic by storing my name
    2. By storing multiple args as key and the their sum as value
    3. I am stimulating API response here by caching the data for 3 secs
For all these approach I am creating a function which is returning an inner function and hence refrence of variables on outer 
function are refrenced and kept alive even after closed execution    
*/

// Basic cache
function createCache() {
    const cache = {}   

    return {
        set(key, value) {
            cache[key] = value
            return `Stored: ${key} = ${value}`
        },
        get(key) {
            if (cache[key] !== undefined) {
                return `From cache: ${cache[key]}`
            }
            return `Not found: ${key}`
        },
        clear() {
            Object.keys(cache).forEach(key => delete cache[key])
            return "Cache cleared"
        },
        size() {
            return Object.keys(cache).length
        }
    }
}

const cache = createCache()
console.log(cache.set("name", "Sarah"))  // Stored: name = Sarah
console.log(cache.get("name"))           // From cache: Sarah
console.log(cache.get("age"))            // Not found: age
console.log(cache.size())                // 1
console.log(cache.clear())               // Cache cleared
console.log(cache.size())                // 0

// Memoize with multiple arguments
function memoize(fn) {
    const cache = {}   // closes over cache

    return function(...args) {   // rest params — any number of args
        const key = JSON.stringify(args)  // convert args to string key
        

        if (cache[key] !== undefined) {
            console.log(`Cache hit for: ${key}`)
            return cache[key]
        }

        console.log(`Computing for: ${key}`)
        const result = fn(...args)  // spread args back to function
        cache[key] = result
        return result
    }
}
const slowAdd = (a, b) => a + b
const fastAdd = memoize(slowAdd)

console.log(fastAdd(2, 3))   // Computing → 5
console.log(fastAdd(2, 3))   // Cache hit → 5
console.log(fastAdd(3, 2))   // Computing → 5 Since (2,3) and (3,2) are different keys 


// Memoize with expiry
function memoizeWithExpiry(fn, ttl) { 
    const cache = {}

    return function(...args) {
        const key = JSON.stringify(args)
        const now = Date.now()

        if (cache[key] && now - cache[key].timestamp < ttl) {
            console.log(`Cache hit (expires in ${Math.round((ttl - (now - cache[key].timestamp))/1000)}s)`)
            return cache[key].value
        }

        const result = fn(...args)
        cache[key] = {
            value: result,
            timestamp: now
        }
        return result
    }
}
// simulate API response
const cachedFetch = memoizeWithExpiry((id) => {
    console.log(`Fetching user ${id}...`)
    return { id, name: "Sarah" } }, 
3000)  // 3 second expiry

console.log(cachedFetch(1))  // Fetching
console.log(cachedFetch(1))  // Cache hit
console.log(cachedFetch(1))  // Cache hit

setTimeout(() => {
    
    console.log(cachedFetch(1))   // Fetching again — expired
    console.log(cachedFetch(1))  // Cache hit
}, 3000)  // Wait 3 seconds