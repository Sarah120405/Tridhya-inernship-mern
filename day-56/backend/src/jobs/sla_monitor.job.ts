import { backgroundSlaMonitoring } from "../modules/Sla/sla.service";
import cron from "node-cron";
let isRunning = false;

export function startSlaMonitoring() {
  console.log("SLA monitoring scheduler started");

  cron.schedule("* * * * *", async () => {
    if (isRunning) {
      console.log("Previous SLA monitoring is still running. Skipping...");
      return;
    }

    isRunning = true;

    try {
      console.log("Running SLA monitoring...");

      await backgroundSlaMonitoring();

      console.log("SLA monitoring completed");
    } catch (error) {
      console.error("SLA monitoring failed:", error);
    } finally {
      isRunning = false;
    }
  });
}
