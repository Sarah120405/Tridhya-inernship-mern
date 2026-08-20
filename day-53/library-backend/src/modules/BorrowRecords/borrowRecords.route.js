import {
  borrowBookController,
  returnBookController,
} from "./borrowRecords.controller.js";
import express from "express";

const route = express.Router();

route.post("/borrow/:bookId", borrowBookController);
route.post("/return/:id", returnBookController);

export default route;
