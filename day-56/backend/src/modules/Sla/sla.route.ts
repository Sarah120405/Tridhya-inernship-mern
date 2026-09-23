import express from "express";
import {
  getSLAByTicketIdController,
  getSLAController,
  slaBreachController,
} from "./sla.controller";
import { requireAuth } from "../../middleware/requireAuth.middleware";

const route = express.Router();

route.get("/:id", requireAuth, getSLAByTicketIdController);
route.get("/sla_breach/:ticketId", requireAuth, slaBreachController);
route.get("/", requireAuth, getSLAController);
export default route;
