import prisma from "../../config/db.config";

export async function createMessages(
  ticketId: string,
  senderId: string,
  senderRole: string,
  content: string,
) {
  const result = await prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.findUnique({
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

    if (senderRole === "Customer") {
      if (ticket.customerId !== senderId) {
        throw {
          status: 403,
          message: "Unauthorized: You are not the owner of this ticket.",
        };
      }
    } else if (senderRole === "SupportAgent") {
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

    const message = await tx.message.create({
      data: {
        ticketId,
        senderId,
        content,
      },
    });

    const sla = await tx.sLA.findUnique({
      where: { ticketId },
    });

    if (sla && !sla.firstRespondedAt && senderRole === "SupportAgent") {
      await tx.sLA.update({
        where: { ticketId },
        data: {
          firstRespondedAt: new Date(),
        },
      });
    }
    return message;
  });
  return result;
}

export async function getMessageByTicketId(
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
        message: "Unauthorized: You are not the owner of this ticket.",
      };
    }
  } else if (userRole === "SupportAgent") {
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

  const messages = await prisma.message.findMany({
    where: { ticketId },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      sender: {
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
