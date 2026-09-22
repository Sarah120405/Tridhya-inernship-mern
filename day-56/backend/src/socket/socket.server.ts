import { Server } from "socket.io";
import http from "http";

let io: Server;

export function initSocket(httpServer: http.Server) {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔥 BACKEND SOCKET CONNECTED:", socket.id);

    socket.on("disconnect", (reason) => {
      console.log("🔥 BACKEND SOCKET DISCONNECTED:", socket.id, reason);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io has not been initialized.");
  }

  return io;
}
