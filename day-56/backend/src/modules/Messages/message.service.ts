import prisma from "../../config/db.config";

export async function createMessages(
  ticketId: string,
  senderId: string,
  senderRole: string,
  messageData: any,
) {
  const result = await prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.findUnique({
      where: { id: ticketId },
    });

    const aiSuggestionUsed = messageData.aiSuggestionUsed;
    if (!ticket) {
      throw {
        status: 404,
        message: "Ticket not found.",
      };
    }

    if (aiSuggestionUsed) {
      if (
        !messageData.aiSuggestion.suggestedResponse ||
        messageData.aiSuggestion.suggestedResponse.trim() === ""
      ) {
        throw {
          status: 400,
          message: "AI content cannot be empty.",
        };
      }
    } else {
      if (!messageData.content || messageData.content.trim() === "") {
        throw {
          status: 400,
          message: "Message content cannot be empty.",
        };
      }
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

    if (aiSuggestionUsed && senderRole !== "SupportAgent") {
      throw {
        status: 403,
        message: "Only support agents can use AI response suggestions.",
      };
    }
    const message = await tx.message.create({
      data: {
        ticketId,
        senderId,
        content: aiSuggestionUsed
          ? messageData.aiSuggestion.suggestedResponse
          : messageData.content,
        isAIGenerated: aiSuggestionUsed,
      },
    });

    if (aiSuggestionUsed) {
      await tx.aIAnalysis.create({
        data: {
          ticketId: ticketId,
          type: "AGENT_RESPONSE",
          suggestedResponse: messageData.aiSuggestion.suggestedResponse,
          confidence: messageData.aiSuggestion.confidence,
          reasoning: messageData.aiSuggestion.reasoning,
          responseUsed: true,
        },
      });
    }
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
