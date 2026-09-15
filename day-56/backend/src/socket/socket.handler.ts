import { Socket } from "socket.io";
import prisma from "../config/db.config";

export function registerSocketHandlers(socket: Socket) {
  socket.on("joinTicket", async (ticketId: string) => {
    try {
      const user = socket.data.user;
      if (!user) {
        socket.emit("ticketError", { message: "Authentication required." });
        return;
      }
      const ticket = await prisma.ticket.findUnique({
        where: {
          id: ticketId,
        },
      });
      if (!ticket) {
        socket.emit("ticketError", { message: "Ticket not found." });
        return;
      }
      if (user.role === "Customer") {
        if (ticket.customerId !== user.id) {
          socket.emit("ticketError", {
            message: "You are not authorized to access this ticket.",
          });
          return;
        }
      } else if (user.role === "SupportAgent") {
        if (ticket.assignedAgentId !== user.id) {
          socket.emit("ticketError", {
            message: "You are not the assigned agent for this ticket.",
          });
          return;
        }
      } else if (user.role === "Developer") {
        if (ticket.assignedDeveloperId !== user.id) {
          socket.emit("ticketError", {
            message: "You are not the assigned developer for this ticket.",
          });
          return;
        }
      }
      const roomName = `ticket:${ticketId}`;
      socket.join(roomName);
      socket.emit("ticketJoined", { ticketId, room: roomName });
      console.log(`User ${user.id} joined ticket room: ${roomName}`);
    } catch (error) {
      console.error("Error joining ticket room:", error);
      socket.emit("ticketError", { message: "Unable to join ticket room." });
    }
  });
}
