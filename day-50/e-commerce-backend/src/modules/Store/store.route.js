import express from "express";
import {
  getBestSellingProductsController,
  getLowStockAlertController,
  getOrderStatusController,
  getRevenueByCategoryController,
  getRevenueOverTimeController,
} from "./store.controller.js";
import { requireAuth, requireAdmin } from "../../middleware/auth.middleware.js";

const route = express.Router();

route.get("/order-status", requireAuth, requireAdmin, getOrderStatusController);
route.get("/low-stock", requireAuth, requireAdmin, getLowStockAlertController);
route.get(
  "/revenue-over-time",
  requireAuth,
  requireAdmin,
  getRevenueOverTimeController,
);
route.get(
  "/best-sellers",
  requireAuth,
  requireAdmin,
  getBestSellingProductsController,
);
route.get(
  "/revenue-by-category",
  requireAuth,
  requireAdmin,
  getRevenueByCategoryController,
);

export default route;
