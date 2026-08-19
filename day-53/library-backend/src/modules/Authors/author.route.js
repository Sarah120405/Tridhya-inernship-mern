import {
  createAuthorController,
  getAllAuthorController,
  getAuthorByIdController,
} from "./author.controller.js";
import express from "express";

const route = express.Router();
route.post("/", createAuthorController);
route.get("/all", getAllAuthorController);
route.get("/:id", getAuthorByIdController);

export default route;
