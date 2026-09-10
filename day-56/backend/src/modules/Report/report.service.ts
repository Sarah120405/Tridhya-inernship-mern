import prisma from "../../config/db.config";

export async function ticketStatistics() {
  const [totalTickets, openTickets, inProgress, resolved, closed, escalated] =
    await Promise.all([
      prisma.ticket.count(),

      prisma.ticket.count({
        where: { status: "OPEN" },
      }),

      prisma.ticket.count({
        where: { status: "IN_PROGRESS" },
      }),

      prisma.ticket.count({
        where: { status: "RESOLVED" },
      }),

      prisma.ticket.count({
        where: { status: "CLOSED" },
      }),

      prisma.ticket.count({
        where: { status: "ESCALATED" },
      }),
    ]);

  return {
    totalTickets,
    openTickets,
    inProgress,
    resolved,
    closed,
    escalated,
  };
}
export async function ticketsDistribution() {
  const [ticketByCategory, ticketByPriority, ticketByStatus] =
    await Promise.all([
      prisma.ticket.groupBy({
        by: ["category"],
        _count: {
          id: true,
        },
      }),
      prisma.ticket.groupBy({
        by: ["priority"],
        _count: {
          id: true,
        },
      }),
      prisma.ticket.groupBy({
        by: ["status"],
        _count: {
          id: true,
        },
      }),
    ]);
  return { ticketByCategory, ticketByPriority, ticketByStatus };
}

export async function SLAPerformance() {
  const slaData = await prisma.sLA.findMany({});

  const now = new Date();

  let totalBreaches = 0;
  let firstResponseBreaches = 0;
  let resolutionBreaches = 0;

  for (const sla of slaData) {
    let firstResponseBreached = false;
    let resolutionBreached = false;

    // First response breach
    if (sla.firstResponseDueAt) {
      if (sla.firstRespondedAt) {
        firstResponseBreached = sla.firstRespondedAt > sla.firstResponseDueAt;
      } else {
        firstResponseBreached = now > sla.firstResponseDueAt;
      }
    }

    // Resolution breach
    if (sla.resolutionDueAt) {
      if (sla.resolutionCompletedAt) {
        resolutionBreached = sla.resolutionCompletedAt > sla.resolutionDueAt;
      } else {
        resolutionBreached = now > sla.resolutionDueAt;
      }
    }

    if (firstResponseBreached) {
      firstResponseBreaches++;
    }

    if (resolutionBreached) {
      resolutionBreaches++;
    }

    if (firstResponseBreached || resolutionBreached) {
      totalBreaches++;
    }
  }

  const totalSLAs = slaData.length;

  const breachPercentage =
    totalSLAs === 0
      ? 0
      : Number(((totalBreaches * 100) / totalSLAs).toFixed(2));

  return {
    totalSLAs,
    totalBreaches,
    breachPercentage,
    firstResponseBreaches,
    resolutionBreaches,
  };
}

export async function teamPerformance() {
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ["Developer", "SupportAgent"],
      },
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  const performance = await Promise.all(
    users.map(async (user) => {
      const tickets = await prisma.ticket.findMany({
        where:
          user.role === "SupportAgent"
            ? { assignedAgentId: user.id }
            : { assignedDeveloperId: user.id },
        select: {
          id: true,
          status: true,
          createdAt: true,
          resolvedAt: true,
          sla: {
            select: { breached: true },
          },
        },
      });
      const resolvedTickets = tickets.filter(
        (ticket) => ticket.status === "RESOLVED",
      );
      const totalResolutionTime = resolvedTickets.reduce((total, ticket) => {
        return (
          total + (ticket.resolvedAt!.getTime() - ticket.createdAt.getTime())
        );
      }, 0);
      const averageResolutionTime =
        resolvedTickets.length === 0
          ? 0
          : totalResolutionTime / resolvedTickets.length;

      const closedTickets = tickets.filter(
        (tickets) => tickets.status === "CLOSED",
      );
      const activeTickets = tickets.filter(
        (tickets) =>
          tickets.status !== "CLOSED" && tickets.status !== "RESOLVED",
      );
      const slaBreaches = tickets.filter(
        (ticket) => ticket.sla?.breached,
      ).length;

      return {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        totalAssigned: tickets.length,
        resolvedTickets,
        closedTickets,
        activeTickets,
        slaBreaches,
        averageResolutionHours: averageResolutionTime / (1000 * 60 * 60),
      };
    }),
  );

  return performance;
}

export async function ticketTrends() {
  const [created, resolved, closed] = await Promise.all([
    prisma.$queryRaw<{ date: Date; tickets: bigint }[]>`
    SELECT
      DATE("createdAt") AS date,
      COUNT(*) AS tickets
    FROM "Ticket"
    GROUP BY DATE("createdAt")
    ORDER BY date ASC
  `,
    prisma.$queryRaw<{ date: Date; tickets: bigint }[]>`
    SELECT
      DATE("resolvedAt") AS date,
      COUNT(*) AS tickets
    FROM "Ticket"
    GROUP BY DATE("resolvedAt")
    ORDER BY date ASC
  `,
    prisma.$queryRaw<{ date: Date; tickets: bigint }[]>`
    SELECT
      DATE("closedAt") AS date,
      COUNT(*) AS tickets
    FROM "Ticket"
    GROUP BY DATE("createdAt")
    ORDER BY date ASC
  `,
  ]);

  const createdAtTrend = created.map((item) => ({
    date: item.date,
    tickets: Number(item.tickets),
  }));

  const resolvedAtTrend = resolved.map((item) => ({
    date: item.date,
    tickets: Number(item.tickets),
  }));

  const closedAtTrend = closed.map((item) => ({
    date: item.date,
    tickets: Number(item.tickets),
  }));

  return { createdAtTrend, resolvedAtTrend, closedAtTrend };
}
