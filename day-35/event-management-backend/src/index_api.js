import express from "express";
import authRoute from "./modules/Auth/auth.route.js";
const route = express.Router();

route.use("/auth", authRoute);

export default route;
