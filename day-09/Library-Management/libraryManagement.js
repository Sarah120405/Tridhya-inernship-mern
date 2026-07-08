// Base class for Books and Magazines that will be stored in library
class LibraryItem {
  static #nextId = 1;
  #id;
  constructor(title, type, copies) {
    this.#id = LibraryItem.#nextId++;
    this.title = title;
    this.type = type;
    this.copies = copies;
  }

  getInfo() {
    console.log(
      `id: ${this.#id}\nTitle: ${this.title} \nCopies: ${this.copies}`,
    );
  } // overridden by subclasses
  get itemId() {
    return this.#id;
  } // getter
}

// Book class is inheriting Library item and have its own function and properties related to book
class Book extends LibraryItem {
  constructor(title, author, genre, copies, ISBN) {
    super(title, "book", copies); // calls parent constructor
    this.author = author;
    this.genre = genre;
    this.ISBN = ISBN;
  }

  // polymorphism — overrides parent with book specific info
  getInfo() {
    super.getInfo();
    console.log(
      `Author: ${this.author} \nGenre: ${this.genre}\nISBN: ${this.ISBN}`,
    );
  }

  // To check if a book is available based in copies
  get available() {
    return this.copies > 0;
  }

  matchSearch(query) {
    const q = query.toLowerCase();
    return (
      this.title.toLowerCase().includes(q) ||
      this.author.toLowerCase().includes(q) ||
      this.genre.toLowerCase().includes(q)
    );
  }
}

// Person parent class for members who can borrow books and librarian who can add, remove books
class Person {
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

// Main Library class responsible for complete management of system
class Library {
  #books = [];
  #members = [];
  #borrowingRecords = [];

  static #instance = null;

  static getInstance() {
    // static method
    if (!Library.#instance) {
      Library.#instance = new Library();
    }
    return Library.#instance;
  }
  findBookByISBN(ISBN) {
    return this.#books.find((book) => book.ISBN === ISBN) || null;
  }

  borrowBook(member, ISBN) {
    const book = this.findBookByISBN(ISBN);
    if (!book) {
      return "Book doesn't exist";
    }
    if (!book.available) {
      return "Book not available";
    }

    const alreadyHasThisBook = member
      .getBorrowedBooks()
      .some((record) => record.book.ISBN === ISBN);

    if (alreadyHasThisBook) {
      return "You already have that book";
    }
    if (!member.canBorrow) {
      return "Borrowing limit reached";
    }

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // adds 14 days

    member.addBorrowRecord({
      book,
      borrowDate,
      dueDate,
      returned: false,
    });
    book.copies--;

    this.#borrowingRecords.push({
      member,
      book,
      borrowDate,
      dueDate,
      returned: false,
    });
    return `Borrowed: ${book.title}`;
  }

  returnBook(member, ISBN) {
    const record = member.markBookReturned(ISBN);

    if (!record) {
      return "Book not borrowed";
    }

    record.book.copies++;

    const libraryRecord = this.#borrowingRecords.find(
      (r) => r.book.ISBN === ISBN && r.member === member && !r.returned,
    );

    if (libraryRecord) {
      libraryRecord.returned = true;
    }

    return `Returned: ${record.book.title} at ${record.returnDate}`;
  }

  addBook(book) {
    const exists = this.#books.some((b) => b.ISBN === book.ISBN);

    if (exists) return false;

    this.#books = [...this.#books, book];
    return true;
  }

  removeBook(ISBN) {
    const isBorrowed = this.#borrowingRecords.some(
      (record) => record.book.ISBN === ISBN && !record.returned,
    );

    if (isBorrowed) {
      return "Book is currently borrowed";
    }

    this.#books = this.#books.filter((b) => b.ISBN !== ISBN);
    return true;
  }

  searchBooks(query) {
    return this.#books.filter((b) => b.matchSearch(query));
  }

  get totalBooks() {
    return this.#books.length;
  }
  get totalMembers() {
    return this.#members.length;
  }

  registerMember(member) {
    const exists = this.#members.some((m) => m.email === member.email);

    if (exists) return "Member already exists";
    this.#members = [...this.#members, member];
  }

  displayBooks() {
    return [...this.#books];
  }
  getAllMembers() {
    return [...this.#members];
  }

  getAllBorrowingRecords() {
    return [...this.#borrowingRecords];
  }

  getCurrentlyBorrowedBooks() {
    const borrowedBooks = this.#borrowingRecords.filter(
      (books) => !books.returned,
    );
    return borrowedBooks;
  }
}
