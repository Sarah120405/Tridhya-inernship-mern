import { Prisma } from "../../../generated/prisma/client";
import prisma from "../../config/db.config";
import bcrypt from "bcrypt";

export async function getAllUsers(
  page: number,
  limit: number,
  filter: string,
  search: string,
) {
  const skip = (page - 1) * limit;
  const where: Prisma.UserWhereInput = {
    ...(filter && filter !== "All"
      ? {
          role: filter as Prisma.EnumRoleFilter["equals"],
        }
      : {}),

    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  };
  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where: where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    totalUsers,
    page,
    limit,
    totalPages: Math.ceil(totalUsers / limit),
  };
}

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

export async function updateUserDetails(userId: string, userData: any) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw { status: 404, message: "User doesn't exist" };
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(userData.name !== undefined && {
        name: userData.name,
      }),
      ...(userData.email !== undefined && {
        email: userData.email,
      }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return updatedUser;
}

export async function updateUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw { status: 404, message: "User doesn't exist" };
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw {
      status: 401,
      message: "Current password is incorrect.",
    };
  }

  const hashedPwd = await bcrypt.hash(newPassword, 10);
  newPassword = hashedPwd;
  const newUser = await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPwd,
    },
  });
  return newUser;
}
type AssignableRole = "Customer" | "SupportAgent" | "Developer";
export async function updateUserRole(userId: string, role: AssignableRole) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw { status: 404, message: "User doesn't exist" };
  }
  if (user.role === role) {
    throw {
      status: 409,
      message: `User is already assigned the ${role} role.`,
    };
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      role: role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return updatedUser;
}
