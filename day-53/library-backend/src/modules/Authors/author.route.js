import {
  createAuthorController,
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
route.get("/all", getAllAuthorController);
route.get("/:id", getAuthorByIdController);

export default route;
