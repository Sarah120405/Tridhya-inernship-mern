import { Request, Response, NextFunction } from "express";
import { getSLA, getSLAByTicketId, slaBreachCheck } from "./sla.service";
import { sendResponse } from "../../utils/response";

export async function getSLAController(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const priority =
      typeof req.query.priority === "string" ? req.query.priority : undefined;

    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;
    const sla = await getSLA(
      req.user.id,
      req.user.role,
      page,
      limit,
      priority,
      search,
    );

    return sendResponse(res, 200, "SLA retrieved successfully.", sla);
  } catch (error) {
    next(error);
  }
}

export async function getSLAByTicketIdController(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) {
  try {
    const ticketId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const sla = await getSLAByTicketId(ticketId, req.user.id, req.user.role);

    return sendResponse(res, 200, "SLA retrieved successfully.", sla);
  } catch (error) {
    next(error);
  }
}

export async function slaBreachController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const ticketId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const sla = await slaBreachCheck(ticketId);
    return sendResponse(res, 200, "SLA Breach calculated successfully", sla);
  } catch (error) {
    next(error);
  }
}
