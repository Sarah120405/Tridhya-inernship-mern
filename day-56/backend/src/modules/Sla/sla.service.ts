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
      ticketId: ticketId,
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

export async function slaBreachCheck(ticketId: string) {
  const slaData = await prisma.sLA.findUnique({
    where: { ticketId },
  });

  if (!slaData) return null;

  const {
    firstRespondedAt,
    firstResponseDueAt,
    resolutionCompletedAt,
    resolutionDueAt,
    breached: alreadyBreached,
    breachedAt: existingBreachedAt,
  } = slaData;

  const now = new Date();

  const breachTimes: Date[] = [];

  // 1. FIRST RESPONSE SLA
  if (firstResponseDueAt) {
    if (firstRespondedAt) {
      // Agent responded, but responded after the deadline
      if (firstRespondedAt > firstResponseDueAt) {
        breachTimes.push(firstResponseDueAt);
      }
    } else {
      // Agent has not responded yet and deadline has passed
      if (now > firstResponseDueAt) {
        breachTimes.push(firstResponseDueAt);
      }
    }
  }

  // 2. RESOLUTION SLA
  if (resolutionDueAt) {
    if (resolutionCompletedAt) {
      // Ticket was resolved, but after the deadline
      if (resolutionCompletedAt > resolutionDueAt) {
        breachTimes.push(resolutionDueAt);
      }
    } else {
      // Ticket is not resolved and deadline has passed
      if (now > resolutionDueAt) {
        breachTimes.push(resolutionDueAt);
      }
    }
  }
  if (breachTimes.length === 0) {
    return slaData;
  }
  const firstBreachAt = breachTimes.reduce((earliest, current) => {
    return current < earliest ? current : earliest;
  });
  const slaUpdate = await prisma.sLA.update({
    where: { ticketId },
    data: {
      breached: true,
      breachedAt:
        alreadyBreached && existingBreachedAt
          ? existingBreachedAt
          : firstBreachAt,
    },
  });

  return slaUpdate;
}
