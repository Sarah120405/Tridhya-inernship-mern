// Main Library class responsible for complete management of system
export default class Library {
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
