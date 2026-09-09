import e from "express";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import {
  agentAssistanceController,
  ticketSuggestionController,
} from "./ai.controller";
import { requireRole } from "../../middleware/requireRole.middleware";

const router = e.Router();
router.post(
  "/analyze-ticket",
  requireAuth,
  requireRole(["Customer"]),
  ticketSuggestionController,
);
router.post(
  "/agent_assistance/:id",
  requireAuth,
  requireRole(["SupportAgent"]),
  agentAssistanceController,
);

export default router;
