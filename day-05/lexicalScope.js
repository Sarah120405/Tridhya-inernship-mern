// Scope chain for function own -> parent function -> global
let x = "global"

function outer() {
    let x = "outer"
    
    function inner() {
        console.log(x)  // "outer" — not "global"
    }
    inner()
}

outer()
