import express from "express";
import {
  register,
  loginController,
  logoutController,
} from "./auth.controllers.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", loginController);
router.post("/logout", logoutController);

export default router;
