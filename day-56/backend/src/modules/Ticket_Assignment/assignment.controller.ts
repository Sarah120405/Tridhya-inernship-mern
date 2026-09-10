import express from "express";
import { sendResponse } from "../../utils/response";

import {
  assignTicketToAgent,
  assignTicketToDeveloper,
} from "./assignment.service";
export async function assignToAgentController(
  req: express.Request & { user?: any },
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const ticketId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const ticket = await assignTicketToAgent(
      ticketId,
      req.body.userId,
      req.user.id,
    );

    return sendResponse(res, 200, "Agent assigned succesfully", ticket);
  } catch (error: any) {
    next(error);
  }
}

export async function assignToDeveloperController(
  req: express.Request & { user?: any },
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const ticketId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const ticket = await assignTicketToDeveloper(
      ticketId,
      req.body.userId,
      req.user.id,
    );

    return sendResponse(res, 200, "Developer assigned succesfully", ticket);
  } catch (error: any) {
    next(error);
  }
}
