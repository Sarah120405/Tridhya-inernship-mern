import type { Request, Response, NextFunction } from "express";
import { cacheClient } from "../socket/socket.cache";
import { sendResponse } from "../utils/response";
import { createHmac } from "node:crypto";

const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 60;

export async function loginRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const ip = req.ip ?? "unknown";
    const key = `supporthub:rate-limit:login:${ip}`;

    const count = await cacheClient.eval(
      `
    local count = redis.call("INCR", KEYS[1])
    local ttl = redis.call("TTL", KEYS[1])

    if count == 1 or ttl == -1 then
      redis.call("EXPIRE", KEYS[1], ARGV[1])
    end

    return count
  `,
      {
        keys: [key],
        arguments: [String(WINDOW_SECONDS)],
      },
    );

    const attempts = Number(count);
    const ttl = await cacheClient.ttl(key);

    res.setHeader("RateLimit-Limit", MAX_ATTEMPTS);
    res.setHeader("RateLimit-Remaining", Math.max(0, MAX_ATTEMPTS - attempts));

    if (attempts > MAX_ATTEMPTS) {
      res.setHeader("Retry-After", Math.max(1, ttl));

      console.log("Too Many Login Attempts");

      return sendResponse(
        res,
        429,
        "Too many login attempts. Please try again later.",
      );
    }
    return next();
  } catch (error) {
    next(error);
  }
}
function getAccountKey(email: string): string {
  const secret = process.env.RATE_LIMIT_HMAC_SECRET;

  if (!secret) {
    throw new Error("RATE_LIMIT_HMAC_SECRET is not configured");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const accountHash = createHmac("sha256", process.env.RATE_LIMIT_HMAC_SECRET!)
    .update(normalizedEmail)
    .digest("hex");

  return `supporthub:rate-limit:authentication:${accountHash}`;
}

export async function accountBasedLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const email = req.body.email;
    if (typeof email !== "string" || !email.trim()) {
      return next();
    }

    const key = getAccountKey(email);

    const attempts = Number((await cacheClient.get(key)) ?? 0);
    const ttl = await cacheClient.ttl(key);

    res.setHeader("RateLimit-Limit", MAX_ATTEMPTS);
    res.setHeader("RateLimit-Remaining", Math.max(0, MAX_ATTEMPTS - attempts));

    if (attempts > MAX_ATTEMPTS) {
      res.setHeader("Retry-After", Math.max(1, ttl));

      console.log("Too Many Login Attempts");

      return sendResponse(
        res,
        429,
        "Too many failed login attempts. Please try again later.",
      );
    }
    return next();
  } catch (error) {
    next(error);
  }
}
