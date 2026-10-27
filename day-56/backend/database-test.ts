/* import prisma from "./src/config/db.config";

async function testDatabaseLatency() {
  try {
    for (let i = 1; i <= 5; i++) {
      const start = performance.now();

      await prisma.user.findUnique({
        where: {
          email: "YOUR_TEST_ACCOUNT_EMAIL",
        },
        select: {
          id: true,
        },
      });

      console.log(`Lookup ${i}: ${(performance.now() - start).toFixed(2)} ms`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseLatency();
 */

import { cacheClient, connectCacheRedis } from "./src/socket/socket.cache";

async function testRateLimitter() {
  for (let i = 1; i <= 5; i++) {
    const start = performance.now();

    await connectCacheRedis();
    await cacheClient.ping();

    console.log(
      `[Redis Ping ${i}] ${(performance.now() - start).toFixed(2)} ms`,
    );
  }
}
testRateLimitter();
