import { Request, Response, NextFunction } from "express";
import {
  createInternalMessage,
  getInternalMessagesByTicketId,
} from "./internalMsg.service";
import { sendResponse } from "../../utils/response";

export async function createMessageController(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) {
  try {
    const ticketId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const message = await createInternalMessage(
      ticketId,
      req.user.id,
      req.body.content,
      req.user.role,
    );
    return sendResponse(res, 201, "Message created successfully", message);
  } catch (err: any) {
    next(err);
  }
}

export async function getMessagesByTicketIdController(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) {
  try {
    const ticketId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const messages = await getInternalMessagesByTicketId(
      ticketId,
      req.user.id,
      req.user.role,
    );
    return sendResponse(res, 200, "Messages retrieved successfully", messages);
  } catch (err: any) {
    next(err);
  }
}
