import prisma from "../../config/db.config";

export async function Dashboard(userId: string, userRole: string) {
  let where: any = {};
  let whereNeedsAttention: any = {};

  if (userRole === "Customer") {
    where = {
      customerId: userId,
    };

    whereNeedsAttention = {
      customerId: userId,
      status: "WAITING_FOR_CUSTOMER",
    };
  } else if (userRole === "SupportAgent") {
    where = {
      assignedAgentId: userId,
    };

    whereNeedsAttention = {
      assignedAgentId: userId,
      OR: [
        {
          priority: "HIGH",
        },
        {
          priority: "URGENT",
        },
        {
          status: "WAITING_FOR_CUSTOMER",
        },
      ],
    };
  } else if (userRole === "Developer") {
    where = {
      assignedDeveloperId: userId,
    };

    whereNeedsAttention = {
      assignedDeveloperId: userId,
      status: "ESCALATED",
    };
  } else if (userRole === "Admin") {
    // Admin can see all tickets
    where = {};

    whereNeedsAttention = {
      OR: [
        {
          priority: "HIGH",
        },
        {
          priority: "URGENT",
        },
        {
          status: "ESCALATED",
        },
      ],
    };
  } else {
    throw {
      status: 403,
      message: "Unauthorized.",
    };
  }

  const [
    totalTickets,
    openTickets,
    awaitingReply,
    resolvedTickets,
    escalatedTickets,
  ] = await Promise.all([
    prisma.ticket.count({
      where,
    }),

    prisma.ticket.count({
      where: {
        ...where,
        status: "OPEN",
      },
    }),

    prisma.ticket.count({
      where: {
        ...where,
        status: "WAITING_FOR_CUSTOMER",
      },
    }),

    prisma.ticket.count({
      where: {
        ...where,
        status: "RESOLVED",
      },
    }),
    prisma.ticket.count({
      where: {
        ...where,
        status: "ESCALATED",
      },
    }),
  ]);

  const [needsAttention, recentTickets, recentNotifications] =
    await Promise.all([
      prisma.ticket.findMany({
        where: whereNeedsAttention,
        orderBy: {
          updatedAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          ticketNumber: true,
          title: true,
          status: true,
          priority: true,
          updatedAt: true,
        },
      }),

      prisma.ticket.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          ticketNumber: true,
          title: true,
          status: true,
          priority: true,
          updatedAt: true,
        },
      }),

      prisma.ticketActivity.findMany({
        where: {
          ticket: where,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          action: true,
          createdAt: true,
          ticket: {
            select: {
              id: true,
              ticketNumber: true,
              title: true,
            },
          },
        },
      }),
    ]);

  return {
    metrics: {
      totalTickets,
      openTickets,
      awaitingReply,
      resolvedTickets,
      escalatedTickets,
    },
    recentTickets,
    needsAttention,
    recentNotifications,
  };
}

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
type SlaRow = {
  firstResponseDueAt: Date | null;
  firstRespondedAt: Date | null;
  resolutionDueAt: Date | null;
  resolutionCompletedAt: Date | null;
};

export function getSlaBreach(
  sla: SlaRow,
  ticketStatus: string,
  now = new Date(),
) {
  const finished = ticketStatus === "RESOLVED" || ticketStatus === "CLOSED";

  const firstResponse =
    !!sla.firstResponseDueAt &&
    (sla.firstRespondedAt
      ? sla.firstRespondedAt > sla.firstResponseDueAt
      : !finished && now > sla.firstResponseDueAt);

  const resolution =
    !!sla.resolutionDueAt &&
    (sla.resolutionCompletedAt
      ? sla.resolutionCompletedAt > sla.resolutionDueAt
      : !finished && now > sla.resolutionDueAt);

  return { firstResponse, resolution, any: firstResponse || resolution };
}

export async function SLAPerformance() {
  const slaData = await prisma.sLA.findMany({
    include: { ticket: { select: { status: true } } },
  });

  const now = new Date();

  let totalBreaches = 0;
  let firstResponseBreaches = 0;
  let resolutionBreaches = 0;

  for (const sla of slaData) {
    const b = getSlaBreach(sla, sla.ticket.status, now);
    if (b.firstResponse) firstResponseBreaches++;
    if (b.resolution) resolutionBreaches++;
    if (b.any) totalBreaches++;
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
            select: {
              firstResponseDueAt: true,
              firstRespondedAt: true,
              resolutionDueAt: true,
              resolutionCompletedAt: true,
            },
          },
        },
      });
      const resolvedTickets = tickets.filter((t) => t.status === "RESOLVED");
      const closedTickets = tickets.filter((t) => t.status === "CLOSED");

      // used only for the average
      const completedTickets = tickets.filter(
        (t) => t.resolvedAt && t.resolvedAt >= t.createdAt,
      );
      const totalResolutionTime = completedTickets.reduce(
        (sum, t) => sum + (t.resolvedAt!.getTime() - t.createdAt.getTime()),
        0,
      );
      const averageResolutionTime =
        completedTickets.length === 0
          ? 0
          : totalResolutionTime / completedTickets.length;
      const activeTickets = tickets.filter(
        (tickets) =>
          tickets.status !== "CLOSED" && tickets.status !== "RESOLVED",
      );
      const slaBreaches = tickets.filter(
        (t) => t.sla && getSlaBreach(t.sla, t.status).any,
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
    GROUP BY DATE("closedAt")
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
