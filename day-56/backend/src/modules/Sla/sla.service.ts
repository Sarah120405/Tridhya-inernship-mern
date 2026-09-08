import prisma from "../../config/db.config";

export async function getSLAByTicketId(
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
        message: "Unauthorized to view this ticket SLA.",
      };
    }
  } else if (userRole === "SupportAgent") {
    if (ticket.assignedAgentId !== userId) {
      throw {
        status: 403,
        message: "Unauthorized to view this ticket SLA.",
      };
    }
  } else if (userRole === "Developer") {
    if (ticket.assignedDeveloperId !== userId) {
      throw {
        status: 403,
        message: "Unauthorized to view this ticket SLA.",
      };
    }
  } else if (userRole === "Admin") {
  } else {
    throw {
      status: 403,
      message: "Unauthorized: Invalid role.",
    };
  }

  const sla = await prisma.sLA.findUnique({
    where: {
      ticketId,
    },
  });

  if (!sla) {
    throw {
      status: 404,
      message: "SLA not found for this ticket.",
    };
  }

  return sla;
}
