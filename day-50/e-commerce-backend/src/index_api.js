import express from "express";
import storeRoute from "./modules/Store/store.route.js";
import productRoute from "./modules/Product/product.route.js";
import authRoute from "./modules/Auth/auth.route.js";
import userRoute from "./modules/User/user.route.js";
import cartRoute from "./modules/Cart/cart.route.js";
import orderRoute from "./modules/Order/order.route.js";

const route = express.Router();
route.use("/report", storeRoute);
route.use("/product", productRoute);
route.use("/auth", authRoute);
route.use("/user", userRoute);
route.use("/cart", cartRoute);
route.use("/order", orderRoute);

export default route;
