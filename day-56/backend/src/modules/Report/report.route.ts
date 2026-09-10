import e from "express";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import { ticketStatistics } from "./report.service";
import {
  slaPerformanceController,
  teamPerformaceController,
  ticketDistributionController,
  ticketStatisticsController,
  ticketTrendsController,
} from "./report.controller";

const router = e.Router();

router.get(
  "/ticket_statistics",
  requireAuth,
  requireRole(["Admin"]),
  ticketStatisticsController,
);
router.get(
  "/ticket_trends",
  requireAuth,
  requireRole(["Admin"]),
  ticketTrendsController,
);
router.get(
  "/ticket_distribution",
  requireAuth,
  requireRole(["Admin"]),
  ticketDistributionController,
);
router.get(
  "/team_performace",
  requireAuth,
  requireRole(["Admin"]),
  teamPerformaceController,
);
router.get(
  "/sla_performance",
  requireAuth,
  requireRole(["Admin"]),
  slaPerformanceController,
);
export default router;
