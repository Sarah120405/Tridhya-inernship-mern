import express from "express";
import bookRoute from "./modules/Books/book.route.js";
import authorRoute from "./modules/Authors/author.route.js";
import memberRoute from "./modules/Members/member.route.js";
import borrowRoute from "./modules/BorrowRecords/borrowRecords.route.js";

const app = express.Router();
app.use("/book", bookRoute);
app.use("/author", authorRoute);
app.use("/member", memberRoute);
app.use("/borrow_record", borrowRoute);
export default app;
