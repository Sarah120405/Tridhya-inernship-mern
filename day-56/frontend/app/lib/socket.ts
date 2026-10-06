import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../lib/api";

export const socket: Socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("🔥 SOCKET CONNECTED:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("🔥 SOCKET CONNECTION ERROR:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("🔥 SOCKET DISCONNECTED:", reason);
});
