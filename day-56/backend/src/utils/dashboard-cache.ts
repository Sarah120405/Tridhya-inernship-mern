import { cacheClient } from "../socket/socket.cache";

export async function invalidateDashboardCache() {
  try {
    for (const pattern of ["supporthub:dashboard:*", "supporthub:tickets:*"]) {
      let keys: string[] = [];

      for await (const key of cacheClient.scanIterator({
        MATCH: pattern,
        COUNT: 100,
      })) {
        const foundKeys = Array.isArray(key) ? key : [key];
        keys.push(...foundKeys);

        if (keys.length >= 100) {
          await Promise.all(keys.map((cacheKey) => cacheClient.del(cacheKey)));
          keys = [];
        }
      }

      if (keys.length > 0) {
        await Promise.all(keys.map((cacheKey) => cacheClient.del(cacheKey)));
      }
    }
  } catch (error) {}
}
