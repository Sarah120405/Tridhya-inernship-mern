import { sequelize } from "../../config/db.js";
import { Author, Book } from "../../models/index.js";
import { QueryTypes } from "sequelize";
export async function CreateBook(data) {
  const existing = await Book.findOne({ where: { title: data.title } });
  if (existing) {
    const error = new Error("A book with this title already exists");
    error.status = 409;
    throw error;
  }
  const author = await Author.findByPk(data.author_id);
  if (!author) {
    const error = new Error("Author not found");
    error.status = 404;
    throw error;
  }
  const book = await Book.create(data);
  return book;
}

export async function getAllBooks() {
  return Book.findAll({
    include: { model: Author, attributes: ["id", "name"] },
  });
}

export async function getBookById(id) {
  const book = await Book.findByPk(id, {
    include: { model: Author, attributes: ["id", "name", "bio"] },
  });
  if (!book) {
    const error = new Error("Book not found");
    error.status = 404;
    throw error;
  }

  return book;
}

export async function updateBook(bookId, bookData) {
  const book = await Book.findByPk(bookId);
  if (!book) {
    const error = new Error("Book not found");
    error.status = 404;
    throw error;
  }
  const updatedRow = await Book.update(bookData, { where: { id: bookId } });

  const updatedBook = await Book.findByPk(bookId, {
    include: { model: Author, attributes: ["id", "name"] },
  });
  return updatedBook;
}

export async function deleteBook(bookId) {
  const book = await Book.findByPk(bookId);
  if (!book) {
    const error = new Error("Book not found");
    error.status = 404;
    throw error;
  }

  await Book.destroy({ where: { id: bookId } });
  return { message: "Book deleted successfully" };
}

export async function overdueBooks() {
  const [results] = await sequelize.query(
    "SELECT * FROM overdue_books_records",
  );
  return results;
}

export async function bookStatistics() {
  const [books] = await sequelize.query("SELECT * FROM book_borrow_statistics");
  return books;
}

export async function mostBorrowedBooks() {
  const books = await sequelize.query(
    `SELECT books.title, COUNT(borrow_records.id) AS times_borrowed
    FROM books
    JOIN borrow_records ON books.id = borrow_records.book_id
    GROUP BY books.id
    ORDER BY times_borrowed DESC
    LIMIT 5;`,
    { type: sequelize.QueryTypes.SELECT },
  );
  return books;
}
