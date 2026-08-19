import express from "express";
import {
  getAllBooksController,
  getBookByIdController,
  createBookController,
  updateBookController,
  deleteBookController,
} from "./book.controller.js";

const route = express.Router();

route.post("/create", createBookController);
route.get("/", getAllBooksController);
route.get("/:id", getBookByIdController);
route.put("/:id", updateBookController);
route.delete("/:id", deleteBookController);

export default route;
