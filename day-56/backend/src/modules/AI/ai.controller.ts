import express from "express";
import {
  agentAssistance,
  developerAssistance,
  ticketSuggestion,
} from "./ai.service";
import { sendResponse } from "../../utils/response";

export async function ticketSuggestionController(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const suggestion = await ticketSuggestion(req.body);
    return sendResponse(res, 200, "Ticket Suggestion sent", suggestion);
  } catch (error) {
    next(error);
  }
}

export async function agentAssistanceController(
  req: express.Request & { user?: any },
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const ticketId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const suggestion = await agentAssistance(
      ticketId,
      req.user.id,
      req.user.role,
    );
    return sendResponse(res, 200, "Agent assistance sent", suggestion);
  } catch (error) {
    next(error);
  }
}

export async function developerAssistanceController(
  req: express.Request & { user?: any },
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const ticketId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const summary = await developerAssistance(
      ticketId,
      req.user.id,
      req.user.role,
    );
    return sendResponse(res, 200, "Agent assistance sent", summary);
  } catch (error) {
    next(error);
  }
}
