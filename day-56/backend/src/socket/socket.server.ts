import { Server } from "socket.io";
import http from "http";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

let io: Server;

export async function initSocket(httpServer: http.Server) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
    transports: ["websocket"],
  });

  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();

  pubClient.on("error", (err) => console.error("Redis pub Error", err));
  subClient.on("error", (err) => console.error("Redis sub Error", err));

  await Promise.all([pubClient.connect(), subClient.connect()]);

  io.adapter(createAdapter(pubClient, subClient));
  console.log("Socket.IO Redis adapter connected");

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
