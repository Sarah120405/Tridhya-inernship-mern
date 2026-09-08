import express from "express";
import {
  assignToAgentController,
  assignToDeveloperController,
  createTicketController,
  getTicketsController,
  getTicketsDetailsController,
  getTicketActivityController,
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
router.patch(
  "/agent_assign/:id",
  requireAuth,
  requireRole(["Admin"]),
  assignToAgentController,
);
router.patch(
  "/developer_assign/:id",
  requireAuth,
  requireRole(["Admin", "SupportAgent"]),
  assignToDeveloperController,
);
router.get(
  "/:id/activity",
  requireAuth,
  requireRole(["Customer", "SupportAgent", "Developer", "Admin"]),
  getTicketActivityController,
);
export default router;
