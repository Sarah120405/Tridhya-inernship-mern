import express from "express";
import authRoute from "./modules/Auth/auth.route.js";
import userRoute from "./modules/User/user.route.js";
const route = express.Router();

route.use("/auth", authRoute);
route.use("/user", userRoute);
export default route;
