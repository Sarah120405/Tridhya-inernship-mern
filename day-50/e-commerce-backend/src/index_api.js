import express from "express";
import storeRoute from "./modules/Store/store.route.js";
import productRoute from "./modules/Product/product.route.js";
import authRoute from "./modules/Auth/auth.route.js";
import userRoute from "./modules/User/user.route.js";
/* import eventRoute from "./modules/Event/event.route.js";
import bookingRoute from "./modules/Booking/booking.route.js";
import favoriteRoute from "./modules/Favorite/favorite.route.js"; */
const route = express.Router();
route.use("/report", storeRoute);
route.use("/product", productRoute);
route.use("/auth", authRoute);
route.use("/user", userRoute);
/* route.use("/event", eventRoute);
route.use("/booking", bookingRoute);
route.use("/favorite", favoriteRoute);
 */
export default route;
