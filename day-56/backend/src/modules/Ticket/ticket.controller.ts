import express from "express";
import {
  createTicket,
  getTicketActivity,
  getTickets,
  getTicketsDetails,
  ticketCloseUpdate,
  ticketInDevelopmentUpdate,
  ticketResolvedUpdate,
} from "./ticket.service";
import { sendResponse } from "../../utils/response";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileTypeFromBuffer } from "file-type";
import { TicketCategory, TicketPriority, TicketStatus } from "@prisma/client";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";
import cloudinary from "../../config/cloud.config";

export async function createTicketController(
  req: express.Request & { user?: any },
  res: express.Response,
  next: express.NextFunction,
) {
  const files = (req.files ?? []) as Express.Multer.File[];
  const savedFilePaths: string[] = [];

  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/avif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const uploadedFiles = [];
  try {
    for (const file of files) {
      const detectedType = await fileTypeFromBuffer(file.buffer);

      if (!detectedType || !allowedMimeTypes.includes(detectedType.mime)) {
        return next({
          status: 400,
          success: false,
          message: `Invalid file type: ${file.originalname}`,
        });
      }
    }

    for (const file of files) {
      const uploaded = await uploadToCloudinary(file.buffer, file.originalname);

      uploadedFiles.push({
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: uploaded.url,
        publicId: uploaded.publicId,
        resourceType: uploaded.resourceType,
      });
    }

    const ticket = await createTicket(req.user.id, req.body, uploadedFiles);

    return sendResponse(res, 201, "Ticket created successfully", ticket);
  } catch (err: any) {
    await Promise.all(
      uploadedFiles.map((file) =>
        cloudinary.uploader.destroy(file.publicId).catch(() => undefined),
      ),
    );
    next(err);
  }
}

export async function getTicketsController(
  req: express.Request & { user?: any },
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const filters = {
      search:
        typeof req.query.search === "string" ? req.query.search : undefined,

      status:
        typeof req.query.status === "string"
          ? (req.query.status as TicketStatus)
          : undefined,

      priority:
        typeof req.query.priority === "string"
          ? (req.query.priority as TicketPriority)
          : undefined,

      category:
        typeof req.query.category === "string"
          ? (req.query.category as TicketCategory)
          : undefined,
    };
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const priority =
      typeof req.query.priority === "string" ? req.query.priority : undefined;

    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const tickets = await getTickets(
      req.user.id,
      req.user.role,
      filters,
      page,
      limit,
    );
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

export async function ticketInDevlopmentUpdateController(
  req: express.Request & { user?: any },
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const ticketId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const ticket = await ticketInDevelopmentUpdate(ticketId, req.user.id);

    return sendResponse(
      res,
      200,
      "Ticket succesfully updated to in development",
      ticket,
    );
  } catch (error) {
    next(error);
  }
}

export async function ticketResolvedController(
  req: express.Request & { user?: any },
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const ticketId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const ticket = await ticketResolvedUpdate(
      ticketId,
      req.user.id,
      req.user.role,
    );

    return sendResponse(res, 200, "Ticket succesfully resolved", ticket);
  } catch (error) {
    next(error);
  }
}

export async function ticketCloseUpdateController(
  req: express.Request & { user: any },
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const ticketId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const ticket = await ticketCloseUpdate(
      ticketId,
      req.body.action,
      req.user.id,
    );

    return sendResponse(res, 200, "Ticket status updated successfully", ticket);
  } catch (error) {
    next(error);
  }
}
