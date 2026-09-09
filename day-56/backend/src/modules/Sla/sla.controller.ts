import { Request, Response, NextFunction } from "express";
import { getSLAByTicketId, slaBreachCheck } from "./sla.service";
import { sendResponse } from "../../utils/response";

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
