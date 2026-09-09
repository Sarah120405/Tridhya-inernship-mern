import prisma from "../../config/db.config";

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
    let firstResponseDueAt, resolutionDueAt;
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

export async function assignTicketToAgent(
  ticketId: string,
  agentId: string,
  userId: string,
) {
  const result = await prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw { status: 404, message: "Ticket not found" };
    }

    const agent = await tx.user.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      throw { status: 404, message: "Agent doesn't exist" };
    }
    if (agent.role !== "SupportAgent") {
      throw { status: 403, message: "User is not a support agent" };
    }
    if (!agent.isActive) {
      throw { status: 403, message: "Agent is not active" };
    }

    if (ticket.assignedAgentId === agentId) {
      throw { status: 409, message: "Conflict: Agent is already assigned" };
    }
    const updatedTicket = await tx.ticket.update({
      where: { id: ticketId },
      data: { assignedAgentId: agentId, status: "IN_PROGRESS" },
    });

    const updatedTicketActivity = await tx.ticketActivity.create({
      data: {
        ticketId: ticketId,
        userId: userId,
        action:
          ticket.assignedAgentId === null
            ? "AGENT_ASSIGNED"
            : "AGENT_REASSIGNED",
      },
    });
    return { updatedTicket, updatedTicketActivity };
  });
  return result;
}

export async function assignTicketToDeveloper(
  ticketId: string,
  developerId: string,
  userId: string,
) {
  const result = await prisma.$transaction(async (tx) => {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw { status: 404, message: "Ticket not found" };
    }
    const developer = await prisma.user.findUnique({
      where: { id: developerId },
    });

    if (!developer) {
      throw { status: 404, message: "Developer doesn't exist" };
    }
    if (developer.role !== "Developer") {
      throw { status: 403, message: "User is not a developer" };
    }
    if (!developer.isActive) {
      throw { status: 403, message: "Developer is not active" };
    }
    if (ticket.assignedDeveloperId === developerId) {
      throw {
        status: 409,
        message: "Conflict: This developer is already assigned",
      };
    }

    const updatedTicket = await tx.ticket.update({
      where: { id: ticketId },
      data: { assignedDeveloperId: developerId, status: "ESCALATED" },
    });

    const updatedTicketActivity = await tx.ticketActivity.create({
      data: {
        ticketId: ticketId,
        userId: userId,
        action:
          ticket.assignedDeveloperId === null
            ? "DEVELOPER_ASSIGNED"
            : "DEVELOPER_REASSIGNED",
      },
    });
    return { updatedTicket, updatedTicketActivity };
  });
  return result;
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
    const updatedTicket = await tx.ticket.update({
      where: { id: ticketId },
      data: { status: "RESOLVED" },
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
        resolutionCompletedAt: new Date(),
      },
    });
    return { updatedTicket, updateTicketActivity, updateSLA };
  });
  return result;
}
