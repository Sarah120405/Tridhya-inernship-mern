import express from "express";
import {
  createTicketController,
  getTicketsController,
  getTicketsDetailsController,
  getTicketActivityController,
  ticketInDevlopmentUpdateController,
  ticketResolvedController,
} from "./ticket.controller";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import localFileUpload from "../../middleware/local.fileUpload";
import { validate } from "../../middleware/validate.middleware";
import { createTicketSchema, ticketIdParamsSchema } from "./ticket.validator";

const router = express.Router();
router.post(
  "/",
  requireAuth,
  localFileUpload.array("attachments", 5),
  validate(createTicketSchema),
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
router.get(
  "/:id/activity",
  requireAuth,
  requireRole(["Customer", "SupportAgent", "Developer", "Admin"]),
  getTicketActivityController,
);
router.patch(
  "/developer_update/:id",
  requireAuth,
  requireRole(["Developer"]),
  validate(ticketIdParamsSchema),
  ticketInDevlopmentUpdateController,
);

router.patch(
  "/ticket_resolved/:id",
  requireAuth,
  requireRole(["SupportAgent", "Developer", "Admin"]),
  validate(ticketIdParamsSchema),
  ticketResolvedController,
);
export default router;
