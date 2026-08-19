import express from "express";
import bookRoute from "./modules/Books/book.route.js";
import authorRoute from "./modules/Authors/author.route.js";

const app = express.Router();
app.use("/book", bookRoute);
app.use("/author", authorRoute);

export default app;
