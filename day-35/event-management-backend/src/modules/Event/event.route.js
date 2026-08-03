import express from "express";
import {
  getAllEventsController,
  getEventByIdController,
  createEventController,
} from "./event.controller.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllEventsController);
router.get("/:id", getEventByIdController);
router.post("/", requireAuth, requireAdmin, createEventController);

export default router;
