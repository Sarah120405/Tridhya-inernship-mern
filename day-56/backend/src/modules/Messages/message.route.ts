import {
  createMessageController,
  getMessagesByTicketIdController,
} from "./message.controller";
import express from "express";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import { validate } from "../../middleware/validate.middleware";
import { messageSchema } from "./message.validator";

const router = express.Router();

router.post(
  "/tickets/:id",
  requireAuth,
  requireRole(["Customer", "SupportAgent", "Developer", "Admin"]),
  validate(messageSchema),
  createMessageController,
);
router.get(
  "/tickets/:id",
  requireAuth,
  requireRole(["Customer", "SupportAgent", "Developer", "Admin"]),
  getMessagesByTicketIdController,
);
export default router;
