import {
  authorWithMostBorrow,
  createAuthor,
  getAllAuthor,
  getAuthorById,
  getAuthorsWithNoBorrowedBooks,
  getProlificAuthors,
} from "./author.service.js";

export async function createAuthorController(req, res) {
  try {
    const author = await createAuthor(req.body);
    res.status(201).json(author);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getAllAuthorController(req, res) {
  try {
    const authors = await getAllAuthor();
    res.status(200).json(authors);
  } catch (error) {
    res.status(error.status || 500).json(error.message);
  }
}

export async function getProfilicAuthorController(req, res) {
  try {
    const minBooks = req.query.minBooks ? Number(req.query.minBooks) : 2;
    const authors = await getProlificAuthors(minBooks);
    res.status(200).json(authors);
  } catch (error) {
    res.status(error.status || 500).json(error.message);
  }
}
export async function getAuthorByIdController(req, res) {
  try {
    const author = await getAuthorById(req.params.id);
    res.status(200).json(author);
  } catch (error) {
    res.status(error.status || 500).json(error.message);
  }
}

export async function getAuthorsWithNoBorrowedBooksController(req, res) {
  try {
    const author = await getAuthorsWithNoBorrowedBooks();
    res.status(200).json(author);
  } catch (error) {
    res.status(error.status || 500).json(error.message);
  }
}

export async function authorWithMostBorrowsController(req, res) {
  try {
    const author = await authorWithMostBorrow();
    res.status(200).json(author);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
