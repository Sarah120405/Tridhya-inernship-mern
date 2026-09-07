import prisma from "../../config/db.config";

export async function createTicket(
  userId: string,
  ticketData: any,
  files?: Express.Multer.File[],
) {
  const attachments = files?.map((file) => file.path) || [];
  const ticket = await prisma.ticket.create({
    data: {
      title: ticketData.title,
      description: ticketData.description,
      attachments: attachments,
      category: ticketData.category,
      priority: ticketData.priority,
      customerId: userId,
    },
  });
  return ticket;
}

export async function getTickets(userId: string, role: string) {
  let where = {};
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
    where = {};
  }
  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  if (tickets.length === 0) {
    throw { status: 404, message: "No tickets found" };
  }
  return tickets;
}

export async function getTicketsDetails(
  ticketId: string,
  userId: string,
  role: string,
) {
  let where = {};
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
  }
  const tickets = await prisma.ticket.findFirst({
    where,
  });
  if (!tickets) {
    throw { status: 404, message: "Ticket not found" };
  }

  return tickets;
}
