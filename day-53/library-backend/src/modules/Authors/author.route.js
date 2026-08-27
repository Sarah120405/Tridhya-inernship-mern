import {
  authorWithMostBorrowsController,
  createAuthorController,
  editAuthorController,
  getAllAuthorController,
  getAuthorByIdController,
  getAuthorsWithNoBorrowedBooksController,
  getProfilicAuthorController,
} from "./author.controller.js";
import express from "express";

const route = express.Router();
route.post("/", createAuthorController);
route.get("/profilic_author", getProfilicAuthorController);
route.get("/no_book_borrowed", getAuthorsWithNoBorrowedBooksController);
route.get("/author_most_borrow", authorWithMostBorrowsController);
route.get("/all", getAllAuthorController);
route.get("/:id", getAuthorByIdController);
route.put("/:id", editAuthorController);
export default route;
