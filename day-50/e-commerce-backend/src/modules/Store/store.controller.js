import {
  BestSellingProducts,
  LowStockAlert,
  OrderStatus,
  RevenueByCategory,
  RevenueOverTime,
} from "./store.service.js";

export async function getOrderStatusController(req, res) {
  try {
    const orderStatus = await OrderStatus();
    res.status(200).json(orderStatus);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getLowStockAlertController(req, res) {
  try {
    const threshold = req.query.threshold ? Number(req.query.threshold) : 20;
    const alert = await LowStockAlert(threshold);
    res.status(200).json(alert);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getRevenueOverTimeController(req, res) {
  try {
    const revenue = await RevenueOverTime();
    res.status(200).json(revenue);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getBestSellingProductsController(req, res) {
  try {
    const bestProducts = await BestSellingProducts(req.body);
    res.status(200).json(bestProducts);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getRevenueByCategoryController(req, res) {
  try {
    const revenue = await RevenueByCategory(req.body);
    res.status(200).json(revenue);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
