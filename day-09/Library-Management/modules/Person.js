// Person parent class for members who can borrow books and librarian who can add, remove books
export default class Person {
  static #nextId = 1;
  #id;
  constructor(name, email) {
    this.#id = Person.#nextId++;
    this.name = name;
    this.email = email;
  }

  get itemId() {
    return this.#id;
  }

  getDetails() {
    const masked = this.email.replace(/^(.).*@/, "$1****@");
    return {
      name: this.name,
      email: masked,
    };
  }
}
