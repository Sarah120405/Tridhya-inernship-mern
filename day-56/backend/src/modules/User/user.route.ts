import ex from "express";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import {
  getCustomersController,
  getDevelopersController,
  getSupportAgentController,
} from "./user.controller";

const route = ex.Router();
route.get(
  "/customer",
  requireAuth,
  requireRole(["Admin", "Developer", "SupportAgents"]),
  getCustomersController,
);
route.get(
  "/developers",
  requireAuth,
  requireRole(["Admin", "Developer", "SupportAgent"]),
  getDevelopersController,
);
route.get(
  "/support_agents",
  requireAuth,
  requireRole(["Admin", "Developer", "SupportAgent"]),
  getSupportAgentController,
);

export default route;
