import prisma from "../../config/db.config";

import {
  Prisma,
  TicketStatus,
  TicketActivityAction,
  TicketPriority,
  TicketCategory,
} from "@prisma/client";

import { emailService } from "../../utils/email.service";
import { emitTicketUpdated } from "../../socket/ticket.events";

interface UploadedFile {
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  publicId: string;
  resourceType: string;
}

export async function createTicket(
  userId: string,
  ticketData: any,
  files?: UploadedFile[],
) {
  const result = await prisma.$transaction(async (tx) => {
    const attachments = files?.map((file) => file.url) || [];
    const aiSuggestionUsed = ticketData.aiSuggestionUsed;
    const ticket = await tx.ticket.create({
      data: {
        title: ticketData.title,
        description: ticketData.description,
        attachments: attachments,
        category: aiSuggestionUsed
          ? ticketData.aiSuggestion.suggestedCategory
          : ticketData.category,
        priority: aiSuggestionUsed
          ? ticketData.aiSuggestion.suggestedPriority
          : ticketData.priority,
        customerId: userId,
      },
    });

    if (aiSuggestionUsed) {
      await tx.aIAnalysis.create({
        data: {
          ticketId: ticket.id,
          type: "TICKET_SUGGESTION",
          suggestedCategory: ticketData.aiSuggestion.suggestedCategory,
          suggestedPriority: ticketData.aiSuggestion.suggestedPriority,
          confidence: ticketData.aiSuggestion.confidence,
          reasoning: ticketData.aiSuggestion.reasoning,
        },
      });
    }
    const ticketActivity = await tx.ticketActivity.create({
      data: {
        ticketId: ticket.id,
        userId: userId,
        action: "TICKET_CREATED",
      },
    });
    let firstResponseDueAt: Date, resolutionDueAt: Date;
    if (ticket.priority === "LOW") {
      firstResponseDueAt = new Date(
        ticket.createdAt.getTime() + 24 * 60 * 60 * 1000,
      );
      resolutionDueAt = new Date(
        ticket.createdAt.getTime() + 72 * 60 * 60 * 1000,
      );
    } else if (ticket.priority === "MEDIUM") {
      firstResponseDueAt = new Date(
        ticket.createdAt.getTime() + 12 * 60 * 60 * 1000,
      );
      resolutionDueAt = new Date(
        ticket.createdAt.getTime() + 48 * 60 * 60 * 1000,
      );
    } else if (ticket.priority === "HIGH") {
      firstResponseDueAt = new Date(
        ticket.createdAt.getTime() + 4 * 60 * 60 * 1000,
      );
      resolutionDueAt = new Date(
        ticket.createdAt.getTime() + 24 * 60 * 60 * 1000,
      );
    } else if (ticket.priority === "URGENT") {
      firstResponseDueAt = new Date(
        ticket.createdAt.getTime() + 1 * 60 * 60 * 1000,
      );
      resolutionDueAt = new Date(
        ticket.createdAt.getTime() + 8 * 60 * 60 * 1000,
      );
    } else {
      throw { status: 400, message: "" };
    }

    const sla = await tx.sLA.create({
      data: {
        ticketId: ticket.id,
        firstResponseDueAt: firstResponseDueAt,
        resolutionDueAt: resolutionDueAt,
        dueAt: resolutionDueAt,
      },
    });
    return { ticket, ticketActivity, sla };
  });

  const customer = await prisma.user.findUnique({
    where: { id: userId },
  });
  try {
    if (!customer) {
      console.error("Customer not found:", userId);
    } else {
      await emailService(
        customer.email,
        "Your support ticket has been created",
        `
    <h2>Ticket Created Successfully</h2>
    <p>Hello ${customer.name},</p>

    <p>Your support ticket has been created successfully.</p>

    <p><strong>Ticket Number:</strong> #${result.ticket.ticketNumber}</p>
    <p><strong>Title:</strong> ${result.ticket.title}</p>
    <p><strong>Priority:</strong> ${result.ticket.priority}</p>
    <p><strong>Status:</strong> ${result.ticket.status}</p>

    <p>Our support team will review your ticket and get back to you.</p>

    <p>Thank you,<br>
    Support Desk</p>
  `,
      );
    }
  } catch (error) {
    console.log("Error in sending mail: ", error);
  }
  return result;
}

interface TicketFilters {
  search?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  assignedAgentId?: string;
  assignedDeveloperId?: string;
}

export async function getTickets(
  userId: string,
  role: string,
  filters: TicketFilters = {},
  page: number,
  limit: number,
) {
  const skip = (page - 1) * limit;
  const where: Prisma.TicketWhereInput = {};
  let include: Prisma.TicketInclude = {
    customer: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    assignedAgent: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    assignedDeveloper: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  };

  if (role === "Developer") {
    where.assignedDeveloperId = userId;
  } else if (role === "SupportAgent") {
    where.assignedAgentId = userId;
  } else if (role === "Customer") {
    where.customerId = userId;
  } else if (role === "Admin") {
  } else {
    throw {
      status: 403,
      message: "Unauthorized to get this data",
    };
  }

  const search = filters.search?.trim();

  if (search) {
    const searchConditions: Prisma.TicketWhereInput[] = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];

    if (/^\d+$/.test(search)) {
      searchConditions.push({
        ticketNumber: Number(search),
      });
    }

    if (role === "Admin") {
      searchConditions.push(
        {
          customer: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          customer: {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      );
    }

    where.OR = searchConditions;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (role === "Admin") {
    if (filters.assignedAgentId) {
      where.assignedAgentId = filters.assignedAgentId;
    }

    if (filters.assignedDeveloperId) {
      where.assignedDeveloperId = filters.assignedDeveloperId;
    }
  }

  const tickets = await prisma.ticket.findMany({
    where,
    include,
    orderBy: {
      createdAt: "desc",
    },
    skip: skip,
    take: limit,
  });

  return tickets;
}

export async function getTicketsDetails(
  ticketId: string,
  userId: string,
  role: string,
) {
  let where = {};
  let include = {};
  if (role === "Developer") {
    where = {
      id: ticketId,
      assignedDeveloperId: userId,
    };
    include = {
      assignedDeveloper: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    };
  } else if (role === "SupportAgent") {
    where = {
      id: ticketId,
      assignedAgentId: userId,
    };
    include = {
      assignedDeveloper: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    };
  } else if (role === "Customer") {
    where = {
      id: ticketId,
      customerId: userId,
    };
  } else if (role === "Admin") {
    where = {
      id: ticketId,
    };
    include = {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignedAgent: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignedDeveloper: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    };
  } else {
    throw { status: 403, message: "Unauthorized to get this data" };
  }
  const tickets = await prisma.ticket.findFirst({
    where,
    include,
  });
  if (!tickets) {
    throw { status: 404, message: "Ticket not found" };
  }

  return tickets;
}

export async function getTicketActivity(
  ticketId: string,
  userId: string,
  userRole: string,
) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw {
      status: 404,
      message: "Ticket not found.",
    };
  }

  if (userRole === "Customer") {
    if (ticket.customerId !== userId) {
      throw {
        status: 403,
        message: "Unauthorized to view this ticket activity.",
      };
    }
  } else if (userRole === "SupportAgent") {
    if (ticket.assignedAgentId !== userId) {
      throw {
        status: 403,
        message: "Unauthorized to view this ticket activity.",
      };
    }
  } else if (userRole === "Developer") {
    if (ticket.assignedDeveloperId !== userId) {
      throw {
        status: 403,
        message: "Unauthorized to view this ticket activity.",
      };
    }
  } else if (userRole === "Admin") {
  } else {
    throw {
      status: 403,
      message: "Unauthorized: Invalid role.",
    };
  }

  const ticketActivity = await prisma.ticketActivity.findMany({
    where: {
      ticketId: ticketId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });

  return ticketActivity;
}

export async function ticketInDevelopmentUpdate(
  ticketId: string,
  developerId: string,
) {
  const result = await prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      throw { status: 404, message: "Ticket not found" };
    }
    if (ticket.assignedDeveloperId !== developerId) {
      throw { status: 403, message: "Not authorized to update" };
    }

    if (ticket.status === "IN_DEVELOPMENT") {
      throw { status: 409, message: "Ticket is already in development" };
    }
    if (ticket.status !== "ESCALATED") {
      throw {
        status: 409,
        message: "Ticket must be escalated before development can begin.",
      };
    }
    const updateTicket = await tx.ticket.update({
      where: { id: ticketId },
      data: { status: "IN_DEVELOPMENT" },
    });
    const updateTicketActivity = await tx.ticketActivity.create({
      data: {
        ticketId: ticketId,
        action: "DEVELOPER_UPDATED",
        userId: developerId,
      },
    });
    return { updateTicket, updateTicketActivity };
  });
  emitTicketUpdated(ticketId, {
    ticket: result.updateTicket,
    activity: result.updateTicketActivity,
  });
  const customer = await prisma.user.findUnique({
    where: { id: result.updateTicket.customerId },
  });
  try {
    if (!customer) {
      console.error("Customer not found:", result.updateTicket.customerId);
    } else {
      await emailService(
        customer.email,
        "Your support ticket is escalated to developemnt",
        `
    <h2>Ticket In Development</h2>
    <p>Hello ${customer.name},</p>

    <p>Your support ticket has been escalated to our technical team for investigation.</p>

    <p><strong>Ticket Number:</strong> #${result.updateTicket.ticketNumber}</p>
    <p><strong>Title:</strong> ${result.updateTicket.title}</p>
    <p><strong>Priority:</strong> ${result.updateTicket.priority}</p>
    <p><strong>Status:</strong> ${result.updateTicket.status}</p>

    <p>Our technical team will review your ticket and get back to you.</p>

    <p>Thank you,<br>
    Support Desk</p>
  `,
      );
    }
  } catch (error) {
    console.log("Error in sending mail: ", error);
  }

  return result;
}

export async function ticketResolvedUpdate(
  ticketId: string,
  userId: string,
  userRole: string,
) {
  const result = await prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      throw { status: 404, message: "Ticket not found" };
    }
    if (userRole === "SupportAgent") {
      if (ticket.assignedAgentId !== userId) {
        throw { status: 403, message: "Not authorized to update" };
      }
      if (ticket.status !== "IN_PROGRESS") {
        throw {
          status: 409,
          message: "Ticket must be in progress before resloving.",
        };
      }
    } else if (userRole === "Developer") {
      if (ticket.assignedDeveloperId !== userId) {
        throw { status: 403, message: "Not authorized to update" };
      }
      if (ticket.status !== "IN_DEVELOPMENT") {
        throw {
          status: 409,
          message: "Ticket must be in developement before resolving.",
        };
      }
    } else if (userRole === "Admin") {
    } else {
      throw { status: 403, message: "Invalid role" };
    }
    const resolvedAt = new Date();
    const updatedTicket = await tx.ticket.update({
      where: { id: ticketId },
      data: { status: "RESOLVED", resolvedAt: resolvedAt },
    });
    const updateTicketActivity = await tx.ticketActivity.create({
      data: {
        ticketId: ticketId,
        userId: userId,
        action: "TICKET_RESOLVED",
      },
    });
    const updateSLA = await tx.sLA.update({
      where: { ticketId: ticketId },
      data: {
        resolutionCompletedAt: resolvedAt,
      },
    });
    return { updatedTicket, updateTicketActivity, updateSLA };
  });
  emitTicketUpdated(ticketId, {
    ticket: result.updatedTicket,
    activity: result.updateTicketActivity,
  });
  const customer = await prisma.user.findUnique({
    where: { id: result.updatedTicket.customerId },
  });
  try {
    if (!customer) {
      console.error("Customer not found:", result.updatedTicket.customerId);
    } else {
      await emailService(
        customer.email,
        "Your support ticket has been resolved",
        `
    <h2>Ticket Successfully Resolved</h2>
    <p>Hello ${customer.name},</p>

    <p>Your support ticket has been resolved successfully.</p>

    <p><strong>Ticket Number:</strong> #${result.updatedTicket.ticketNumber}</p>
    <p><strong>Title:</strong> ${result.updatedTicket.title}</p>
    <p><strong>Priority:</strong> ${result.updatedTicket.priority}</p>
    <p><strong>Status:</strong> ${result.updatedTicket.status}</p>

    <p>Our team has successfully resolved your issue. Please review the resolution and let us know if you experience any further problems.</p>

    <p>Thank you,<br>
    Support Desk</p>
  `,
      );
    }
  } catch (error) {
    console.log("Error in sending mail: ", error);
  }

  return result;
}

export async function ticketCloseUpdate(
  ticketId: string,
  action: "CLOSE" | "REOPEN",
  customerId: string,
) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw {
      status: 404,
      message: "Ticket not found",
    };
  }

  if (customerId !== ticket.customerId) {
    throw {
      status: 403,
      message: "Unauthorized to update the ticket",
    };
  }

  if (ticket.status !== "RESOLVED") {
    throw {
      status: 409,
      message: "Only resolved tickets can be closed or reopened.",
    };
  }

  let newStatus: TicketStatus;
  let newAction: TicketActivityAction;

  if (action === "CLOSE") {
    newStatus = TicketStatus.CLOSED;
    newAction = TicketActivityAction.TICKET_CLOSED;
  } else if (action === "REOPEN") {
    newStatus = ticket.assignedDeveloperId
      ? TicketStatus.IN_DEVELOPMENT
      : TicketStatus.IN_PROGRESS;
    newAction = TicketActivityAction.STATUS_CHANGED;
  } else {
    throw {
      status: 400,
      message: `Invalid action: ${action}`,
    };
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedTicket = await tx.ticket.update({
      where: { id: ticketId },
      data: {
        status: newStatus,
        ...(action === "REOPEN" ? { resolvedAt: null } : {}),
        ...(action === "CLOSE" ? { closedAt: new Date() } : {}),
      },
    });

    const ticketActivity = await tx.ticketActivity.create({
      data: {
        ticketId,
        userId: customerId,
        action: newAction,
      },
    });

    if (action === "REOPEN") {
      await tx.sLA.update({
        where: { ticketId },
        data: {
          resolutionCompletedAt: null,
        },
      });
    }

    return {
      updatedTicket,
      ticketActivity,
    };
  });

  emitTicketUpdated(ticketId, {
    ticket: result.updatedTicket,
    activity: result.ticketActivity,
  });
  const notificationTicket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
    include: {
      customer: {
        select: {
          name: true,
        },
      },
      assignedAgent: {
        select: {
          name: true,
          email: true,
        },
      },
      assignedDeveloper: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!notificationTicket) {
    return result;
  }

  const subject =
    action === "CLOSE"
      ? `Ticket #${notificationTicket.ticketNumber} Closed by Customer`
      : `Ticket #${notificationTicket.ticketNumber} Reopened by Customer`;

  const heading =
    action === "CLOSE"
      ? "Ticket Closed by Customer"
      : "Ticket Reopened by Customer";

  const message =
    action === "CLOSE"
      ? "The customer has confirmed that the issue has been resolved and closed the ticket."
      : "The customer has reported that the issue still exists and reopened the ticket.";

  const emailRecipients = [
    notificationTicket.assignedAgent?.email,
    notificationTicket.assignedDeveloper?.email,
  ].filter((email): email is string => Boolean(email));

  await Promise.allSettled(
    emailRecipients.map((email) =>
      emailService(
        email,
        subject,
        `
          <h2>${heading}</h2>

          <p>Hello,</p>

          <p>${message}</p>

          <p><strong>Ticket Number:</strong> #${notificationTicket.ticketNumber}</p>
          <p><strong>Title:</strong> ${notificationTicket.title}</p>
          <p><strong>Customer:</strong> ${notificationTicket.customer.name}</p>
          <p><strong>Priority:</strong> ${notificationTicket.priority}</p>
          <p><strong>Status:</strong> ${notificationTicket.status}</p>
          <p><strong>Updated By:</strong>  ${notificationTicket.customer.name}</p>

          <p>Please review the ticket in SupportHub for further details.</p>
          <p>
            Thank you,<br>
            Support Desk
          </p>
        `,
      ),
    ),
  );

  return result;
}
