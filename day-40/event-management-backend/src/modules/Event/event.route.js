import express from "express";
import {
  updateEventController,
  deleteEventController,
  getAllEventsController,
  getEventByIdController,
  createEventController,
} from "./event.controller.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createEventSchema } from "./event.validator.js";
import { requireRole } from "../../middleware/abac.middleware.js";

const router = express.Router();

router.get("/", getAllEventsController);
router.get("/:id", getEventByIdController);
router.post(
  "/",
  requireAuth,
  requireRole("admin", "organizer"),
  validate(createEventSchema),
  createEventController,
);
// event.route.js
router.put(
  "/:id",
  requireAuth,
  requireRole("admin", "organizer"),
  updateEventController,
);
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin", "organizer"),
  deleteEventController,
);

export default router;
