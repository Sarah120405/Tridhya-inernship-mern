import Order from "../../models/Order.js";
import Product from "../../models/Product.js";

export async function OrderStatus() {
  const orderStatus = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  return orderStatus;
}

export async function LowStockAlert(threshold) {
  const products = await Product.find({ stock: { $lte: threshold } });

  // Temporary verification of single index
  /* const stats = await Product.find({ stock: { $lte: 50 } }).explain(
    "executionStats",
  );
  console.log(stats); */

  return products;
}

export async function RevenueOverTime() {
  const results = await Order.aggregate([
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return results.map((r) => ({
    month: `${monthNames[r._id.month - 1]} ${r._id.year}`,
    revenue: r.revenue,
  }));
}
export async function BestSellingProducts() {
  const bestSellingProduct = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productName",
        totalSold: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);
  return bestSellingProduct;
}
export async function RevenueByCategory() {
  const revenueCategory = await Order.aggregate([
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    { $unwind: "$productInfo" },
    {
      $group: {
        _id: "$productInfo.category",
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        itemsSold: { $sum: "$items.quantity" },
      },
    },
    {
      $sort: { revenue: -1 },
    },
  ]);
  return revenueCategory;
}
