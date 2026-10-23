import { Queue } from "bullmq";
import IORedis from "ioredis";

export const queueRedis = new IORedis(
  process.env.REDIS_URL ?? "redis://localhost:6379",
);

export const ticketEmailQueue = new Queue("ticket-emails", {
  connection: queueRedis,
});
