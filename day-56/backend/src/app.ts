import http from "http";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment");
}
import cookieParser from "cookie-parser";
import cors from "cors";
import index_api from "./index_api";
import { errorHandler } from "./middleware/error.middleware";
import { startSlaMonitoring } from "./jobs/sla_monitor.job";
import { socketAuthMiddleware } from "./socket/socket.middleware";
import { registerSocketHandlers } from "./socket/socket.handler";
import { initSocket } from "./socket/socket.server";

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

const httpServer = http.createServer(app);
const io = initSocket(httpServer);
io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  const expiresAt = socket.data.user?.expiresAt;

  let expiryTimer: NodeJS.Timeout | undefined;

  if (expiresAt) {
    const remainingTime = expiresAt - Date.now();

    if (remainingTime <= 0) {
      socket.emit("auth:expired", {
        message: "Your session has expired. Please log in again.",
      });

      socket.disconnect(true);
      return;
    }

    expiryTimer = setTimeout(() => {
      socket.emit("auth:expired", {
        message: "Your session has expired. Please log in again.",
      });

      socket.disconnect(true);
    }, remainingTime);
  }

  const user = socket.data.user;

  if (user) {
    const userRoom = `user:${user.id}`;
    socket.join(userRoom);

    console.log(`User ${user.id} joined user room: ${userRoom}`);
  }

  registerSocketHandlers(socket);

  socket.on("disconnect", () => {
    if (expiryTimer) {
      clearTimeout(expiryTimer);
    }

    console.log("Socket disconnected:", socket.id);
  });
});
app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);
app.use(cookieParser());
app.use("/api", index_api);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

/* app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startSlaMonitoring();
});
 */

httpServer.listen(PORT, () => {
  console.log("Server running on port: ", PORT);
  startSlaMonitoring();
});
