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
router.get("/socket-token", requireAuth, (req, res) => {
  const token = req.cookies.token;
  res.json({ token });
});
router.get(
  "/me",
  requireAuth,
  async (req: express.Request & { user?: any }, res: express.Response) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    let totalTickets = 0;

    if (user.role === "Customer") {
      totalTickets = await prisma.ticket.count({
        where: {
          customerId: user.id,
        },
      });
    } else if (user.role === "SupportAgent") {
      totalTickets = await prisma.ticket.count({
        where: {
          assignedAgentId: user.id,
        },
      });
    } else if (user.role === "Developer") {
      totalTickets = await prisma.ticket.count({
        where: {
          assignedDeveloperId: user.id,
        },
      });
    } else if (user.role === "Admin") {
      totalTickets = await prisma.ticket.count();
    }

    return sendResponse(res, 200, "User found", {
      ...user,
      totalTickets,
    });
  },
);
export default router;
