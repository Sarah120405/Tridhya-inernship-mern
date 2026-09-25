import http from "http";
import { Server } from "socket.io";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment");
}
import cookieParser from "cookie-parser";
import path from "path";
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
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

const httpServer = http.createServer(app);
const io = initSocket(httpServer);
io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  console.log("Authenticated user:", socket.data.user);
  registerSocketHandlers(socket);

  socket.on("disconnect", () => {
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
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
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
