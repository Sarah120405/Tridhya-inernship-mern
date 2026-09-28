import ex from "express";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import {
  getAllUsersController,
  getCustomersController,
  getDevelopersController,
  getSupportAgentController,
  updatePasswordController,
  updateRoleController,
  updateUserController,
} from "./user.controller";
import { validate } from "../../middleware/validate.middleware";
import { updateUserRoleSchema } from "./user.validator";

const route = ex.Router();

route.get(
  "/",
  requireAuth as any,
  requireRole(["Admin"]) as any,
  getAllUsersController as any,
);

route.get(
  "/customer",
  requireAuth as any,
  requireRole(["Admin", "Developer", "SupportAgents"]) as any,
  getCustomersController as any,
);
route.get(
  "/developers",
  requireAuth as any,
  requireRole(["Admin", "Developer", "SupportAgent"]) as any,
  getDevelopersController as any,
);
route.get(
  "/support_agents",
  requireAuth as any,
  requireRole(["Admin", "Developer", "SupportAgent"]) as any,
  getSupportAgentController as any,
);

route.put(
  "/update_user",
  requireAuth as any,
  requireRole(["Customer", "Admin", "Developer", "SupportAgents"]) as any,
  updateUserController as any,
);
route.patch(
  "/update_password",
  requireAuth as any,
  requireRole(["Customer", "Admin", "Developer", "SupportAgents"]) as any,
  updatePasswordController as any,
);
route.patch(
  "/update_role/:id",
  requireAuth as any,
  requireRole(["Admin"]) as any,
  validate(updateUserRoleSchema, "body"),
  updateRoleController as any,
);

export default route;
