import express from "express";
import {
  getSLAByTicketIdController,
  slaBreachController,
} from "./sla.controller";
import { requireAuth } from "../../middleware/requireAuth.middleware";

const route = express.Router();

route.get("/:id", requireAuth, getSLAByTicketIdController);
route.get("/sla_breach/:ticketId", requireAuth, slaBreachController);

export default route;
