import { Request, Response, NextFunction } from "express";
import {
  SLAPerformance,
  teamPerformance,
  ticketsDistribution,
  ticketStatistics,
  ticketTrends,
} from "./report.service";
import { sendResponse } from "../../utils/response";

export async function ticketStatisticsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const statistics = await ticketStatistics();
    return sendResponse(
      res,
      200,
      "Statistics retrieved successfully",
      statistics,
    );
  } catch (error) {
    next(error);
  }
}

export async function ticketDistributionController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const statistics = await ticketsDistribution();
    return sendResponse(
      res,
      200,
      "Statistics retrieved successfully",
      statistics,
    );
  } catch (error) {
    next(error);
  }
}

export async function teamPerformaceController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const statistics = await teamPerformance();
    return sendResponse(
      res,
      200,
      "Statistics retrieved successfully",
      statistics,
    );
  } catch (error) {
    next(error);
  }
}

export async function ticketTrendsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const statistics = await ticketTrends();
    return sendResponse(
      res,
      200,
      "Statistics retrieved successfully",
      statistics,
    );
  } catch (error) {
    next(error);
  }
}
export async function slaPerformanceController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const statistics = await SLAPerformance();
    return sendResponse(
      res,
      200,
      "Statistics retrieved successfully",
      statistics,
    );
  } catch (error) {
    next(error);
  }
}
