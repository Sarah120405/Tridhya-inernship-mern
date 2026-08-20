import {
  createMemberController,
  getAllMembersController,
  getMemberBorrowSummaryController,
  getMemberByIdController,
} from "./member.controller.js";

import express from "express";

const route = express.Router();
route.post("/", createMemberController);
route.get("/all", getAllMembersController);
route.get("/:id", getMemberByIdController);
route.get("/borrow_summary", getMemberBorrowSummaryController);

export default route;
