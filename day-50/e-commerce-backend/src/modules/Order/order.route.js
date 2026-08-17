import express from "express";
import {
  createOrderFromCartController,
  getAllOrdersController,
  getMyOrdersController,
} from "./order.controller.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.middleware.js";

const route = express.Router();
route.post("/checkout/", requireAuth, createOrderFromCartController);
route.get("/my-orders/", requireAuth, getMyOrdersController);
route.get("/all/", requireAuth, requireAdmin, getAllOrdersController);
export default route;
