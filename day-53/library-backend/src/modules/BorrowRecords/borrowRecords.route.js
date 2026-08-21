import {
  borrowBookController,
  returnBookController,
  getActiveBorrowRecordsController,
  borrowingTrendsController,
} from "./borrowRecords.controller.js";
import express from "express";

const route = express.Router();

route.post("/borrow/:bookId", borrowBookController);
route.post("/return/:id", returnBookController);
route.get("/active_borrow", getActiveBorrowRecordsController);
route.get("/borrowing_trends", borrowingTrendsController);

export default route;
