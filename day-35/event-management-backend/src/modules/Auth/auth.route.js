import express from "express";
import { register, loginController } from "./auth.controllers.js";

const router = express.Router();

router.post("/register", register);
router.get("/login", loginController);

export default router;
