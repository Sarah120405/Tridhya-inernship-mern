import express from "express";
import {
  createTicketController,
  getTicketsController,
  getTicketsDetailsController,
} from "./ticket.controller";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import localFileUpload from "../../middleware/local.fileUpload";

const router = express.Router();
router.post(
  "/",
  requireAuth,
  localFileUpload.array("attachments", 5),
  createTicketController,
);
router.get(
  "/",
  requireAuth,
  requireRole(["Customer", "SupportAgent", "Developer", "Admin"]),
  getTicketsController,
);
router.get(
  "/:id",
  requireAuth,
  requireRole(["Customer", "SupportAgent", "Developer", "Admin"]),
  getTicketsDetailsController,
);

export default router;
