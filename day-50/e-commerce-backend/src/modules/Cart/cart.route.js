import {
  getOrCreateCartController,
  addItemToCartController,
  updateItemQuantityController,
  removeItemFromCartController,
} from "./cart.controller.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.middleware.js";
import express from "express";

const route = express.Router();
route.get("/", requireAuth, getOrCreateCartController);
route.post("/:productId", requireAuth, addItemToCartController);
route.put("/:productId", requireAuth, updateItemQuantityController);
route.delete("/:productId", requireAuth, removeItemFromCartController);

export default route;
