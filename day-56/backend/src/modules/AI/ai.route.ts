import e from "express";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import {
  agentAssistanceController,
  developerAssistanceController,
  ticketSuggestionController,
} from "./ai.controller";
import { requireRole } from "../../middleware/requireRole.middleware";
import { validate } from "../../middleware/validate.middleware";
import { aiTicketIdParamsSchema, analyzeTicketSchema } from "./ai.validator";

const router = e.Router();
router.post(
  "/analyze-ticket",
  requireAuth,
  requireRole(["Customer"]),
  validate(analyzeTicketSchema),
  ticketSuggestionController,
);
router.post(
  "/agent_assistance/:id",
  requireAuth,
  requireRole(["SupportAgent"]),
  validate(aiTicketIdParamsSchema),
  agentAssistanceController,
);
router.post(
  "/developer_assistance/:id",
  requireAuth,
  requireRole(["Developer"]),
  validate(aiTicketIdParamsSchema),
  developerAssistanceController,
);
export default router;
