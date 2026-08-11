import express from "express";
import {
  updateEventController,
  deleteEventController,
  getAllEventsController,
  getEventByIdController,
  createEventController,
  getMyRecentEventsController,
} from "./event.controller.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { requireRole } from "../../middleware/abac.middleware.js";
import localFileUpload from "../../middleware/local.fileUpload.js";
import { createEventSchema } from "./event.validator.js";

const router = express.Router();

router.get("/", getAllEventsController);
router.get(
  "/my-recent",
  requireAuth,
  requireRole("organizer", "admin"),
  getMyRecentEventsController,
);
router.get("/:id", getEventByIdController);
router.post(
  "/",
  requireAuth,
  requireRole("admin", "organizer"),
  localFileUpload.single("eventBanner"),
  validate(createEventSchema),
  createEventController,
);
router.put(
  "/:id",
  requireAuth,
  requireRole("admin", "organizer"),
  localFileUpload.single("eventBanner"),
  updateEventController,
);
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin", "organizer"),
  deleteEventController,
);

export default router;
