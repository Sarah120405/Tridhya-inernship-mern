import {
  CreateBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "./book.service.js";

export async function createBookController(req, res) {
  try {
    const book = await CreateBook(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getAllBooksController(req, res) {
  try {
    const books = await getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getBookByIdController(req, res) {
  try {
    const book = await getBookById(req.params.id);
    res.status(200).json(book);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function updateBookController(req, res) {
  try {
    const book = await updateBook(req.params.id, req.body);
    res.status(200).json(book);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function deleteBookController(req, res) {
  try {
    const book = await deleteBook(req.params.id);
    res.status(200).json(book);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
