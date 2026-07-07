const o = {
  a: 1,
  b: 2,
  // __proto__ sets the [[Prototype]]. It's specified here as another object literal.
  __proto__: {
    b: 3,
    c: 4,
  },
};

/* 
    o.[[Prototype]] has properties b and c.
    Finally, o.[[Prototype]].[[Prototype]].[[Prototype]] is null.
    This is the end of the prototype chain, as null,
    { a: 1, b: 2 } ---> { b: 3, c: 4 } ---> Object.prototype ---> null
 */
console.log(o.a); // 1

console.log(o.b); // 2
// Is there a 'b' own property on o? Yes, and its value is 2.
// The prototype also has a 'b' property, but it's not visited.
// This is called Property Shadowing

console.log(o.c); // 4
// As 'c'in not in obj protoype is checked obj.[[Prototype]]? Yes, its value is 4.

console.log(o.d); // undefined
/* as d is not in o o.[[Prototype]].[[Prototype]].[[Prototype]] is checked till null then stop searching as 
no property found, return undefined.
 */

// Before ES6 classes, this is how inheritance worked
function Animal(name, sound) {
  this.name = name;
  this.sound = sound;
}

// Methods go on prototype — shared between all instances
Animal.prototype.speak = function () {
  return `${this.name} says ${this.sound}`;
};

Animal.prototype.toString = function () {
  return `Animal: ${this.name}`;
};

const dog = new Animal("Dog", "Woof");
const cat = new Animal("Cat", "Meow");

console.log(dog.speak());
console.log(cat.speak());

// Both instances share the SAME speak method via prototype
console.log(dog.speak === cat.speak); // true — not copied, shared
// Prototype chain
console.log(dog.__proto__ === Animal.prototype); // true
console.log(Animal.prototype.__proto__ === Object.prototype); // true
