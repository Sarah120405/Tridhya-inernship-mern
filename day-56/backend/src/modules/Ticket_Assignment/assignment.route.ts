import express from "express";
import {
  assignToAgentController,
  assignToDeveloperController,
} from "./assignment.controller";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import { validate } from "../../middleware/validate.middleware";
import { ticketIdParamsSchema } from "../Ticket/ticket.validator";

const router = express.Router();

router.patch(
  "/agent/:id",
  requireAuth,
  requireRole(["Admin"]),
  validate(ticketIdParamsSchema, "params"),
  assignToAgentController,
);
router.patch(
  "/developer/:id",
  requireAuth,
  requireRole(["Admin", "SupportAgent"]),
  validate(ticketIdParamsSchema, "params"),
  assignToDeveloperController,
);

export default router;
