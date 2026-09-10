import prisma from "../../config/db.config";
import { emailService } from "../../utils/email.service";

export async function createTicket(
  userId: string,
  ticketData: any,
  files?: Express.Multer.File[],
) {
  const result = await prisma.$transaction(async (tx) => {
    const attachments = files?.map((file) => file.path) || [];
    const ticket = await tx.ticket.create({
      data: {
        title: ticketData.title,
        description: ticketData.description,
        attachments: attachments,
        category: ticketData.category,
        priority: ticketData.priority,
        customerId: userId,
      },
    });
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

export async function getTickets(userId: string, role: string) {
  let where: any = {};
  let include: any = {};
  if (role === "Developer") {
    where = {
      assignedDeveloperId: userId,
    };
  } else if (role === "SupportAgent") {
    where = {
      assignedAgentId: userId,
    };
  } else if (role === "Customer") {
    where = {
      customerId: userId,
    };
  } else if (role === "Admin") {
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
  const tickets = await prisma.ticket.findMany({
    where,
    include,
    orderBy: {
      createdAt: "desc",
    },
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
  } else if (role === "SupportAgent") {
    where = {
      id: ticketId,
      assignedAgentId: userId,
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
