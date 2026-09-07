import express from "express";
import {
  createMessageController,
  getMessagesByTicketIdController,
} from "./internalMsg.controller";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";

const router = express.Router();

router.post(
  "/internal-messages/:id",
  requireAuth,
  requireRole(["SupportAgent", "Developer", "Admin"]),
  createMessageController,
);
router.get(
  "/internal-messages/:id",
  requireAuth,
  requireRole(["SupportAgent", "Developer", "Admin"]),
  getMessagesByTicketIdController,
);

export default router;
