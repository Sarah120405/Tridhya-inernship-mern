import {
  createMessageController,
  getMessagesByTicketIdController,
} from "./message.controller";
import express from "express";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";

const router = express.Router();

router.post(
  "/tickets/:id",
  requireAuth,
  requireRole(["Customer", "SupportAgent", "Developer", "Admin"]),
  createMessageController,
);
router.get(
  "/tickets/:id",
  requireAuth,
  requireRole(["Customer", "SupportAgent", "Developer", "Admin"]),
  getMessagesByTicketIdController,
);
export default router;
