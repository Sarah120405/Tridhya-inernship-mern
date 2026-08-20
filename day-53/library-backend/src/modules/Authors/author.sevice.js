import { literal, Op } from "sequelize";
import { sequelize } from "../../config/db.js";
import { Author, Book } from "../../models/index.js";

export async function createAuthor(authorData) {
  const existing = await Author.findOne({ where: { name: authorData.name } });
  if (existing) {
    const error = new Error("An author with this name already exists");
    error.status = 409;
    throw error;
  }
  const author = await Author.create(authorData);
  return author;
}

export async function getAllAuthor() {
  const authors = await Author.findAll({
    attributes: [
      "id",
      "name",
      "bio",
      [sequelize.fn("COUNT", sequelize.col("Books.id")), "book_count"],
    ],
    include: {
      model: Book,
      attributes: [],
    },
    group: ["Author.id"],
  });
  return authors;
}

export async function getProlificAuthors(minBooks = 2) {
  return Author.findAll({
    attributes: [
      "id",
      "name",
      "bio",
      [sequelize.fn("COUNT", sequelize.col("Books.id")), "book_count"],
    ],
    include: {
      model: Book,
      attributes: [],
    },
    group: ["Author.id"],
    having: sequelize.where(sequelize.fn("COUNT", sequelize.col("Books.id")), {
      [Op.gte]: minBooks,
    }),
  });
}

export async function getAuthorById(authorId) {
  const author = await Author.findByPk(authorId, {
    include: {
      model: Book,
      attributes: ["id", "title", "genre", "published_year"],
    },
  });

  if (!author) {
    const error = new Error("Author not found");
    error.status = 404;
    throw error;
  }

  return author;
}

export async function getAuthorsWithNoBorrowedBooks() {
  return Author.findAll({
    where: {
      id: {
        [Op.notIn]: literal(
          `(SELECT author_id FROM books WHERE id IN (SELECT book_id FROM borrow_records))`,
        ),
      },
    },
  });
}
