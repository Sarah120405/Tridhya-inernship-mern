import prisma from "../../config/db.config";
import { emailService } from "../../utils/email.service";

export async function assignTicketToAgent(
  ticketId: string,
  agentId: string,
  userId: string,
) {
  const result = await prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw { status: 404, message: "Ticket not found" };
    }

    const agent = await tx.user.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      throw { status: 404, message: "Agent doesn't exist" };
    }
    if (agent.role !== "SupportAgent") {
      throw { status: 403, message: "User is not a support agent" };
    }
    if (!agent.isActive) {
      throw { status: 403, message: "Agent is not active" };
    }

    if (ticket.assignedAgentId === agentId) {
      throw { status: 409, message: "Conflict: Agent is already assigned" };
    }
    const updatedTicket = await tx.ticket.update({
      where: { id: ticketId },
      data: { assignedAgentId: agentId, status: "IN_PROGRESS" },
    });

    const updatedTicketActivity = await tx.ticketActivity.create({
      data: {
        ticketId: ticketId,
        userId: userId,
        action:
          ticket.assignedAgentId === null
            ? "AGENT_ASSIGNED"
            : "AGENT_REASSIGNED",
      },
    });
    return { agent, updatedTicket, updatedTicketActivity };
  });

  try {
    await emailService(
      result.agent.email,
      "New Support Ticket Assigned to You",
      `
      <h2>Ticket Assigned Successfully</h2>
      <p>Hello ${result.agent.name},</p>
  
      <p>You have been assigned following ticket: </p>
  
      <p><strong>Ticket Number:</strong> #${result.updatedTicket.ticketNumber}</p>
      <p><strong>Title:</strong> ${result.updatedTicket.title}</p>
      <p><strong>Priority:</strong> ${result.updatedTicket.priority}</p>
      <p><strong>Status:</strong> ${result.updatedTicket.status}</p>
  
      <p>Make sure to connect with customer and solve there problem within deadline</p>
  
      <p>Thank you,<br>
      Admin</p>
    `,
    );
  } catch (error) {
    console.log("Error in sending mail: ", error);
  }
  return result;
}

export async function assignTicketToDeveloper(
  ticketId: string,
  developerId: string,
  userId: string,
) {
  const result = await prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw { status: 404, message: "Ticket not found" };
    }
    const developer = await tx.user.findUnique({
      where: { id: developerId },
    });

    if (!developer) {
      throw { status: 404, message: "Developer doesn't exist" };
    }
    if (developer.role !== "Developer") {
      throw { status: 403, message: "User is not a developer" };
    }
    if (!developer.isActive) {
      throw { status: 403, message: "Developer is not active" };
    }
    if (ticket.assignedDeveloperId === developerId) {
      throw {
        status: 409,
        message: "Conflict: This developer is already assigned",
      };
    }

    const updatedTicket = await tx.ticket.update({
      where: { id: ticketId },
      data: { assignedDeveloperId: developerId, status: "ESCALATED" },
    });

    const updatedTicketActivity = await tx.ticketActivity.create({
      data: {
        ticketId: ticketId,
        userId: userId,
        action:
          ticket.assignedDeveloperId === null
            ? "DEVELOPER_ASSIGNED"
            : "DEVELOPER_REASSIGNED",
      },
    });
    return { developer, updatedTicket, updatedTicketActivity };
  });
  try {
    await emailService(
      result.developer.email,
      "New Technical Ticket Assigned to You",
      `
      <h2>Ticket Assigned Successfully</h2>
      <p>Hello ${result.developer.name},</p>
  
      <p>You have been assigned following ticket: </p>
  
      <p><strong>Ticket Number:</strong> #${result.updatedTicket.ticketNumber}</p>
      <p><strong>Title:</strong> ${result.updatedTicket.title}</p>
      <p><strong>Priority:</strong> ${result.updatedTicket.priority}</p>
      <p><strong>Status:</strong> ${result.updatedTicket.status}</p>
  
      <p>A support ticket has been escalated to you for technical investigation.
        Please review the ticket details and investigate the reported issue within the SLA deadline.</p>
  
      <p>Thank you,<br>
      Admin</p>
    `,
    );
  } catch (error) {
    console.log("Error in sending mail: ", error);
  }

  return result;
}
