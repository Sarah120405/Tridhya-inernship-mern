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
import { socketAuthMiddleware } from "./socket/socket.middleware";
import { registerSocketHandlers } from "./socket/socket.handler";
import { initSocket } from "./socket/socket.server";
import { connectCacheRedis } from "./socket/socket.cache";
import "./background-jobs/email.worker";
import { ticketEmailWorker } from "./background-jobs/email.worker";
import { queueRedis, ticketEmailQueue } from "./socket/socket.email.queue";
import { workerRedis } from "./background-jobs/redis.connection";
import prisma from "./config/db.config";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
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

const httpServer = http.createServer(app);

async function bootstrap() {
  await prisma.$connect();
  console.log("Prisma Connected");

  await connectCacheRedis();
  const io = await initSocket(httpServer);
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

  httpServer.listen(PORT, () => {
    console.log("Server running on port: ", PORT);
  });
}

let isShuttingDown = false;

async function shutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`[Shutdown] Received ${signal}. Starting graceful shutdown...`);

  try {
    // Stop accepting new HTTP requests.
    await new Promise<void>((resolve, reject) => {
      httpServer.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Stop accepting new jobs and wait for active jobs to finish.
    await ticketEmailWorker.close();

    // Close the queue before its Redis connection.
    await ticketEmailQueue.close();

    // Close the dedicated BullMQ Redis connections.
    await Promise.all([workerRedis.quit(), queueRedis.quit()]);

    console.log("[Shutdown] BullMQ resources closed successfully.");
  } catch (error) {
    console.error("[Shutdown] Error during shutdown:", error);
    process.exitCode = 1;
  }
}

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

/* app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startSlaMonitoring();
});
 */

/* httpServer.listen(PORT, () => {
  console.log("Server running on port: ", PORT);
});
 */
