import {
  getTicketEmailQueueStats,
  queueRedis,
  ticketEmailQueue,
} from "./src/socket/socket.email.queue";

async function main() {
  try {
    const stats = await getTicketEmailQueueStats();
    console.log("Ticket email queue stats:", stats);
  } finally {
    // Close the Redis-backed queue connection so this one-shot monitor exits.
    await ticketEmailQueue.close();
    await queueRedis.quit();
  }
}

main().catch((error) => {
  console.error("Could not read ticket email queue stats:", error);
  process.exitCode = 1;
});
