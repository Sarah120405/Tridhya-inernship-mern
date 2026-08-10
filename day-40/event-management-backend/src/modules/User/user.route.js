// src/routes/user.routes.js
import express from "express";
import { requireAuth, requireAdmin } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/abac.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { z } from "zod";
import User from "../../models/User.js";
import {
  getAdminStatsController,
  getRecentActivityController,
  getBookingTrendsController,
  updateUserRoleController,
} from "./user.controller.js";

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash");
  res.json(user);
});
router.get("/stats", requireAuth, requireAdmin, getAdminStatsController);
router.get(
  "/recent-activity",
  requireAuth,
  requireAdmin,
  getRecentActivityController,
);
router.get(
  "/booking-trends",
  requireAuth,
  requireAdmin,
  getBookingTrendsController,
);

router.patch(
  "/:id/role",
  requireAuth,
  requireRole("admin"),
  validate(z.object({ role: z.enum(["user", "organizer", "admin"]) })),
  updateUserRoleController,
);
export default router;
