import e from "express";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import {
  customerDashboardController,
  slaPerformanceController,
  teamPerformaceController,
  ticketDistributionController,
  ticketStatisticsController,
  ticketTrendsController,
} from "./report.controller";

const router = e.Router();

router.get(
  "/dashboard",
  requireAuth as any,
  requireRole(["Customer", "SupportAgent", "Developer", "Admin"]) as any,
  customerDashboardController as any,
);
router.get(
  "/ticket_statistics",
  requireAuth as any,
  requireRole(["Admin"]) as any,
  ticketStatisticsController as any,
);
router.get(
  "/ticket_trends",
  requireAuth as any,
  requireRole(["Admin"]) as any,
  ticketTrendsController as any,
);
router.get(
  "/ticket_distribution",
  requireAuth as any,
  requireRole(["Admin"]) as any,
  ticketDistributionController as any,
);
router.get(
  "/team_performace",
  requireAuth as any,
  requireRole(["Admin"]) as any,
  teamPerformaceController as any,
);
router.get(
  "/sla_performance",
  requireAuth as any,
  requireRole(["Admin"]) as any,
  slaPerformanceController as any,
);

export default router;
