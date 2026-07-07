// Base class for Books and Magazines that will be stored in library
class LibraryItem {
  #id;
  constructor(title, type, copies) {
    this.#id = Date.now();
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

// Similar to book class but for magazine
class Magazine extends LibraryItem {
  constructor(title, issueNo, publisher, copies) {
    super(title, "Magazine", copies);
    this.issueNo = issueNo;
    this.publisher = publisher;
  }
  getInfo() {
    super.getInfo();
    console.log(`\nPublisher: ${this.publisher}\n Issue No: ${this.issueNo}`);
  }
}

// Person parent class for members who can borrow books and librarian who can add, remove books
class Person {
  #id;
  constructor(name, email) {
    this.#id = Date.now();
    this.name = name;
    this.email = email;
  }

  getDetails() {
    const masked = this.email.replace(/^(.).*@/, "$1****@");
    return `Name: ${this.name} | Email: ${masked}`;
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
    this.#borrowingHistory.push(record);

    return record;
  }

  calculateFine(ISBN) {
    const record = this.#borrowingHistory.find((r) => r.book.ISBN === ISBN);

    if (!record) return 0;

    const today = new Date();
    if (today <= record.dueDate) return 0;

    const overdueDays = Math.ceil(
      (today - record.dueDate) / (1000 * 60 * 60 * 24),
    );

    return overdueDays * 5;
  }

  getBorrowedBooks() {
    return this.#borrowedBooks.filter((book) => !book.returned);
  }

  getBorrowingHistory() {
    return this.#borrowingHistory;
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
    library.addBook(book);
    console.log(`${this.name} added ${book.title}`);
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
    return this.#books.find((book) => book.ISBN === ISBN);
  }

  borrowBook(member, book) {
    if (!book.available) {
      return "Book not available";
    }

    if (!member.canBorrow) {
      // note: canBorrow is getter, no ()
      return "Borrowing limit reached";
    }

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // adds 14 days correctly

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

    return `Returned: ${record.book.title}`;
  }

  addBook(book) {
    this.#books = [...this.#books, book];
  }

  removeBook(ISBN) {
    this.#books = this.#books.filter((b) => b.ISBN !== ISBN);
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
    this.#members = [...this.#members, member];
  }

  displayBooks() {
    return this.#books;
  }

  getCurrentlyBorrowedBooks() {
    const borrowedBooks = this.#borrowingRecords.filter(
      (books) => !books.returned,
    );
    return borrowedBooks;
  }
}
