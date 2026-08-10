import express from "express";
import {
  register,
  loginController,
  logoutController,
} from "./auth.controllers.js";
import { validate } from "../../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "./auth.validator.js";
const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), loginController);
router.post("/logout", logoutController);

export default router;
