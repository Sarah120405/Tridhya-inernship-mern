import express from "express";
import {
  assignTicketToAgent,
  assignTicketToDeveloper,
  createTicket,
  getTicketActivity,
  getTickets,
  getTicketsDetails,
} from "./ticket.service";
import { sendResponse } from "../../utils/response";
import { fileTypeFromFile } from "file-type";
import fs from "fs";

export async function createTicketController(
  req: express.Request & { user?: any },
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      for (const file of files) {
        const detectedType = await fileTypeFromFile(file.path);

        if (
          !detectedType ||
          ![
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "image/avif",
          ].includes(detectedType.mime)
        ) {
          await fs.promises.unlink(file.path);
          const error = {
            status: 400,
            success: false,
            message: `Invalid image file: ${file.originalname}`,
          };
          return next(error);
        }
      }
    }
    const ticket = await createTicket(req.user.id, req.body, files);
    return sendResponse(res, 201, "Ticket created successfully", ticket);
  } catch (err: any) {
    next(err);
  }
}

export async function getTicketsController(
  req: express.Request & { user?: any },
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const tickets = await getTickets(req.user.id, req.user.role);
    return sendResponse(res, 200, "Tickets fetched successfully", tickets);
  } catch (err: any) {
    next(err);
  }
}

export async function getTicketsDetailsController(
  req: express.Request & { user?: any },
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const ticketId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const tickets = await getTicketsDetails(
      ticketId,
      req.user.id,
      req.user.role,
    );
    return sendResponse(
      res,
      200,
      "Ticket details fetched successfully",
      tickets,
    );
  } catch (err: any) {
    next(err);
  }
}

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

export async function getTicketActivityController(
  req: express.Request & { user?: any },
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const ticketId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const activities = await getTicketActivity(
      ticketId,
      req.user.id,
      req.user.role,
    );

    return sendResponse(
      res,
      200,
      "Ticket activity retrieved successfully",
      activities,
    );
  } catch (err) {
    next(err);
  }
}
