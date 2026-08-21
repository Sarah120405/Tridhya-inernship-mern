import {
  borrowBook,
  borrowingTrends,
  returnBook,
  getActiveBorrowRecords,
} from "./borrowRecords.service.js";

export async function borrowBookController(req, res) {
  try {
    const borrow = await borrowBook(req.params.bookId, req.body.memberId);
    res.status(200).json(borrow);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function returnBookController(req, res) {
  try {
    const bookReturn = await returnBook(req.params.id);
    res.status(200).json(bookReturn);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getActiveBorrowRecordsController(req, res) {
  try {
    const books = await getActiveBorrowRecords();
    res.status(200).json(books);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function borrowingTrendsController(req, res) {
  try {
    const trends = await borrowingTrends();
    res.status(200).json(trends);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
