import express from "express";
import {
  getBestSellingProductsController,
  getLowStockAlertController,
  getOrderStatusController,
  getRevenueByCategoryController,
  getRevenueOverTimeController,
} from "./store.controller.js";

const route = express.Router();

route.get("/orderStatus", getOrderStatusController);
route.get("/lowStockAlert", getLowStockAlertController);
route.get("/revenueOverTime", getRevenueOverTimeController);
route.get("/bestSellingProduct", getBestSellingProductsController);
route.get("/revenueByCategory", getRevenueByCategoryController);

export default route;
