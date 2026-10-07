import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../lib/api";

export const socket: Socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("🔥 SOCKET CONNECTED:", socket.id);
});

socket.io.on("reconnect", (attempt) => {
  console.log("🔥 SOCKET RECONNECTED, attempt:", attempt);
});

socket.on("connect_error", (error) => {
  console.error("🔥 SOCKET CONNECTION ERROR:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("🔥 SOCKET DISCONNECTED:", reason);
});
