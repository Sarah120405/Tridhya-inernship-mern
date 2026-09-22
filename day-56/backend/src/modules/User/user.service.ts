import prisma from "../../config/db.config";

export async function getDevelopers(userId: string, userRole: string) {
  if (userRole !== "Admin" && userRole !== "SupportAgent") {
    throw {
      status: 403,
      message: "You are not authorized to view developers.",
    };
  }

  return prisma.user.findMany({
    where: {
      role: "Developer",
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
}

export async function getCustomers(userId: string, userRole: string) {
  if (userRole === "Admin") {
    return prisma.user.findMany({
      where: {
        role: "Customer",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }

  if (userRole === "SupportAgent") {
    return prisma.user.findMany({
      where: {
        role: "Customer",
        isActive: true,
        customerTickets: {
          some: {
            assignedAgentId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }

  if (userRole === "Developer") {
    return prisma.user.findMany({
      where: {
        role: "Customer",
        isActive: true,
        customerTickets: {
          some: {
            assignedDeveloperId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }

  throw {
    status: 403,
    message: "You are not authorized to view customers.",
  };
}

export async function getSupportAgents(userId: string, userRole: string) {
  if (userRole === "Admin") {
    return prisma.user.findMany({
      where: {
        role: "SupportAgent",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }

  if (userRole === "Developer") {
    return prisma.user.findMany({
      where: {
        role: "SupportAgent",
        isActive: true,
        customerTickets: {
          some: {
            assignedDeveloperId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }

  throw {
    status: 403,
    message: "You are not authorized to view support agents.",
  };
}
