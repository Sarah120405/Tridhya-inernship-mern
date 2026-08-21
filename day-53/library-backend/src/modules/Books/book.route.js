import express from "express";
import {
  getAllBooksController,
  getBookByIdController,
  createBookController,
  updateBookController,
  deleteBookController,
  overdueBooksController,
  bookStatisticsController,
  mostBorrowedBooksController,
} from "./book.controller.js";

const route = express.Router();

route.post("/create", createBookController);
route.get("/", getAllBooksController);
route.get("/overdue_books", overdueBooksController);
route.get("/book_statistics", bookStatisticsController);
route.get("/most-borrowed", mostBorrowedBooksController);
route.get("/:id", getBookByIdController);
route.put("/:id", updateBookController);
route.delete("/:id", deleteBookController);

export default route;
