import express from "express";
import { requireAuth, requireAdmin } from "../../middleware/auth.middleware.js";
import localFileUpload from "../../middleware/local.fileUpload.js";
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from "./product.controller.js";

const route = express.Router();
route.post(
  "/",
  requireAuth,
  requireAdmin,
  localFileUpload.single("image"),
  createProductController,
);
route.get("/", getAllProductsController);
route.get("/:id", getProductByIdController);
route.put(
  "/:id",
  requireAuth,
  localFileUpload.single("image"),
  updateProductController,
);
route.delete("/:id", requireAuth, deleteProductController);

export default route;
