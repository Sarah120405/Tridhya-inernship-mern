import prisma from "../../config/db.config";

export async function createInternalMessage(
  ticketId: string,
  senderId: string,
  content: string,
  senderRole: string,
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

  if (!content || content.trim() === "") {
    throw {
      status: 400,
      message: "Message content cannot be empty.",
    };
  }

  if (senderRole === "SupportAgent") {
    if (ticket.assignedAgentId !== senderId) {
      throw {
        status: 403,
        message:
          "Unauthorized: You are not the assigned support agent for this ticket.",
      };
    }
  } else if (senderRole === "Developer") {
    if (ticket.assignedDeveloperId !== senderId) {
      throw {
        status: 403,
        message:
          "Unauthorized: You are not the assigned developer for this ticket.",
      };
    }
  } else if (senderRole !== "Admin") {
    throw {
      status: 403,
      message: "Unauthorized: Invalid role.",
    };
  }

  const message = await prisma.internalNote.create({
    data: {
      ticketId,
      authorId: senderId,
      content: content.trim(),
    },
  });

  return message;
}

export async function getInternalMessagesByTicketId(
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

  if (userRole === "SupportAgent") {
    if (ticket.assignedAgentId !== userId) {
      throw {
        status: 403,
        message:
          "Unauthorized: You are not the assigned support agent for this ticket.",
      };
    }
  } else if (userRole === "Developer") {
    if (ticket.assignedDeveloperId !== userId) {
      throw {
        status: 403,
        message:
          "Unauthorized: You are not the assigned developer for this ticket.",
      };
    }
  } else if (userRole !== "Admin") {
    throw {
      status: 403,
      message: "Unauthorized: Invalid role.",
    };
  }

  const messages = await prisma.internalNote.findMany({
    where: { ticketId },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return messages;
}
