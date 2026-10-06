import express from "express";
import {
  getSLAByTicketIdController,
  getSLAController,
  slaBreachController,
  slaMonitoringController,
} from "./sla.controller";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { cronAuth } from "../../middleware/cronAuth.middleware";

const route = express.Router();
route.get("/monitor", cronAuth, slaMonitoringController);

route.get("/:id", requireAuth, getSLAByTicketIdController);
route.get("/sla_breach/:ticketId", requireAuth, slaBreachController);
route.get("/", requireAuth, getSLAController);
export default route;
