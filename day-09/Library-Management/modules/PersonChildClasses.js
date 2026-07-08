import Person from "./Person.js";

// They can borrow and return books
class Member extends Person {
  #borrowedBooks = [];
  #borrowingLimit = 3;
  #borrowingHistory = [];

  constructor(name, email) {
    super(name, email);
  }

  addBorrowRecord(record) {
    this.#borrowedBooks.push(record);
  }

  markBookReturned(ISBN) {
    const record = this.#borrowedBooks.find(
      (r) => r.book.ISBN === ISBN && !r.returned,
    );

    if (!record) return null;

    record.returned = true;
    record.returnDate = new Date();
    this.#borrowingHistory.push(record);

    return record;
  }

  calculateFine(ISBN) {
    const record =
      this.#borrowedBooks.find((r) => r.book.ISBN === ISBN && !r.returned) ||
      this.#borrowingHistory.find((r) => r.book.ISBN === ISBN);

    if (!record) return 0;

    const endDate = record.returnDate || new Date();
    if (endDate <= record.dueDate) return 0;

    const overdueDays = Math.max(
      0,
      Math.ceil((endDate - record.dueDate) / (1000 * 60 * 60 * 24)),
    );

    return overdueDays * 5;
  }

  getBorrowedBooks() {
    return [...this.#borrowedBooks.filter((book) => !book.returned)];
  }

  getBorrowingHistory() {
    return [...this.#borrowingHistory];
  }

  get borrowedCount() {
    return this.#borrowedBooks.filter((r) => !r.returned).length;
  }
  get canBorrow() {
    return this.borrowedCount < this.#borrowingLimit;
  }
}

// Responsible for adding and removing books
class Librarian extends Person {
  constructor(name, email, employeeId) {
    super(name, email);
    this.employeeId = employeeId;
  }

  addBook(library, book) {
    let res = library.addBook(book);

    if (!res) {
      alert("ISBN already exists");
      return "ISBN already exists";
    }

    console.log(`${this.name} added ${book.title}`);
    return true;
  }
  removeBook(library, ISBN) {
    library.removeBook(ISBN);
    console.log(`${this.name} removed a book`);
  }
}

export { Member, Librarian };
