import express from "express";
import {
  loginController,
  registerController,
  logoutController,
} from "./auth.controller";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { sendResponse } from "../../utils/response";
import prisma from "../../config/db.config";
import { validate } from "../../middleware/validate.middleware";
import { loginSchema, registerSchema } from "./auth.validator";

const router = express.Router();
router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.post("/logout", logoutController);
router.get(
  "/me",
  requireAuth,
  async (req: express.Request & { user?: any }, res: express.Response) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    return sendResponse(res, 200, "User found", user);
  },
);
export default router;
