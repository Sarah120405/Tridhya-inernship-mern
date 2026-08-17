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

route.get("/orderStatus", requireAuth, requireAdmin, getOrderStatusController);
route.get(
  "/lowStockAlert",
  requireAuth,
  requireAdmin,
  getLowStockAlertController,
);
route.get(
  "/revenueOverTime",
  requireAuth,
  requireAdmin,
  getRevenueOverTimeController,
);
route.get(
  "/bestSellingProduct",
  requireAuth,
  requireAdmin,
  getBestSellingProductsController,
);
route.get(
  "/revenueByCategory",
  requireAuth,
  requireAdmin,
  getRevenueByCategoryController,
);

export default route;
