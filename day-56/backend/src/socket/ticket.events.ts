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
  io.to(`ticket:${ticketId}`).emit("ticketUpdated", payload);

  const { customerId, assignedAgentId, assignedDeveloperId } =
    payload.ticket as Ticket;
  const recipients = [customerId, assignedAgentId, assignedDeveloperId].filter(
    Boolean,
  );

  recipients.forEach((userId) => {
    io.to(`user:${userId}`).emit("ticketUpdated", payload);
  });
}
