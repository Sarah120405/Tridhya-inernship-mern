import express from "express";
import {
  createMessageController,
  getMessagesByTicketIdController,
} from "./internalMsg.controller";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import { validate } from "../../middleware/validate.middleware";
import { internalMsgSchema } from "./internalMsg.validator";

const router = express.Router();

router.post(
  "/tickets/:id",
  requireAuth,
  requireRole(["SupportAgent", "Developer", "Admin"]),
  validate(internalMsgSchema),
  createMessageController,
);
router.get(
  "/tickets/:id/",
  requireAuth,
  requireRole(["SupportAgent", "Developer", "Admin"]),
  getMessagesByTicketIdController,
);

export default router;
