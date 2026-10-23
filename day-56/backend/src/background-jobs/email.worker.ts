import { Worker } from "bullmq";
import { workerRedis } from "./redis.connection";
import { emailService } from "../utils/email.service";

export const ticketEmailWorker = new Worker(
  "ticket-emails",
  async (job) => {
    if (job.name === "send-ticket-email") {
      const { ticketId, recipient, subject, html } = job.data;

      console.log(`Process email for ticket ${ticketId} to ${recipient}`);
      await emailService(recipient, subject, html); //call email service
    }
  },
  { connection: workerRedis },
);

console.log("[Email Worker] Starting...");

ticketEmailWorker.on("ready", () => {
  console.log("[Email Worker] Ready");
});

ticketEmailWorker.on("error", (err) => {
  console.error("[Email Worker] Error:", err);
});

ticketEmailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

ticketEmailWorker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed`, err.message);
});
