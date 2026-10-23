import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";

export const workerRedis = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});
