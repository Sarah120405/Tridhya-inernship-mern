import { Request, Response, NextFunction } from "express";
import { getSLAByTicketId } from "./sla.service";
import { sendResponse } from "../../utils/response";

export async function getSLA(
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
