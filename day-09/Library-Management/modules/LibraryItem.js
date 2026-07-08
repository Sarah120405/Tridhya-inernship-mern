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

export { LibraryItem, Book };
