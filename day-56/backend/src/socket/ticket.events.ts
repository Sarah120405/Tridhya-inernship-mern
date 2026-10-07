import { TicketActivity, Ticket } from "@prisma/client";
import { getIO } from "./socket.server";

interface TicketUpdatePayload {
  ticket: Ticket;
  activity: TicketActivity;
}

export function emitTicketUpdated(
  ticketId: string,
  payload: TicketUpdatePayload,
) {
  const io = getIO();

  const { customerId, assignedAgentId, assignedDeveloperId } =
    payload.ticket as Ticket;
  const recipients = [customerId, assignedAgentId, assignedDeveloperId].filter(
    Boolean,
  );

  console.log("🔥 EMITTING TICKET UPDATED", {
    ticketId,
    status: payload.ticket.status,
    activityUserId: payload.activity.userId,
    recipients,
  });
  io.to(`ticket:${ticketId}`).emit("ticketUpdated", payload);

  recipients.forEach((userId) => {
    console.log("📡 EMITTING TO USER ROOM", {
      room: `user:${userId}`,
      ticketId,
      status: payload.ticket.status,
    });
    io.to(`user:${userId}`).emit("ticketUpdated", payload);
  });
}
