import express from "express";
import {
  createTicketController,
  getTicketsController,
  getTicketsDetailsController,
  getTicketActivityController,
  ticketInDevlopmentUpdateController,
  ticketResolvedController,
  ticketCloseUpdateController,
} from "./ticket.controller";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import localFileUpload from "../../middleware/local.fileUpload";
import { validate } from "../../middleware/validate.middleware";
import { createTicketSchema, ticketIdParamsSchema } from "./ticket.validator";
import parseAiSuggestion from "../../middleware/parseAiSuggestion.middleware";

const router = express.Router();
router.post(
  "/",
  requireAuth,
  localFileUpload.array("attachments", 5),
  parseAiSuggestion,
  validate(createTicketSchema),
  createTicketController as any,
);
router.get(
  "/",
  requireAuth,
  requireRole(["Customer", "SupportAgent", "Developer", "Admin"]),
  getTicketsController as any,
);
router.get(
  "/:id",
  requireAuth,
  requireRole(["Customer", "SupportAgent", "Developer", "Admin"]),
  getTicketsDetailsController as any,
);
router.get(
  "/:id/activity",
  requireAuth,
  requireRole(["Customer", "SupportAgent", "Developer", "Admin"]),
  getTicketActivityController as any,
);
router.patch(
  "/developer_update/:id",
  requireAuth,
  requireRole(["Developer"]),
  validate(ticketIdParamsSchema, "params"),
  ticketInDevlopmentUpdateController as any,
);

router.patch(
  "/ticket_resolved/:id",
  requireAuth,
  requireRole(["SupportAgent", "Developer", "Admin"]),
  validate(ticketIdParamsSchema, "params"),
  ticketResolvedController as any,
);

router.patch(
  "/ticket_close/:id",
  requireAuth,
  requireRole(["Customer"]),
  validate(ticketIdParamsSchema, "params"),
  ticketCloseUpdateController as any,
);
export default router;
