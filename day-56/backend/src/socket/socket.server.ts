import { Server } from "socket.io";
import http from "http";

let io: Server;

export function initSocket(httpServer: http.Server) {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io has not been initialized.");
  }

  return io;
}
