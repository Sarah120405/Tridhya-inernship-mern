import {
  activeMembersController,
  createMemberController,
  getAllMembersController,
  getMemberBorrowSummaryController,
  getMemberByIdController,
} from "./member.controller.js";

import express from "express";

const route = express.Router();
route.post("/", createMemberController);
route.get("/all", getAllMembersController);
route.get("/borrow_summary/:memberId", getMemberBorrowSummaryController);
route.get("/active_members", activeMembersController);
route.get("/:id", getMemberByIdController);
export default route;
