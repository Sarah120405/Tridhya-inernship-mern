import { createClient } from "redis";

export const cacheClient = createClient({
  url: process.env.REDIS_URL,
});

cacheClient.on("error", (err) => {
  console.error("Redis Cache Client Error:", err);
});

export async function connectCacheRedis() {
  if (!cacheClient.isOpen) {
    await cacheClient.connect();
    console.log("Redis cache client connected");
  }
}
