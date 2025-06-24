import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";

/**
 * Rate limiter for page and API requests.
 * Limits: 30 requests per 30 seconds, blocks for 1 minute.
 */
const pageApiLimiter = new RateLimiterMemory({
  keyPrefix: "page-api",
  points: 30, // Number of requests by userId or IP
  duration: 30, // Time window in seconds
  blockDuration: 60, // Block for 1 minute
});

/**
 * Rate limiter for authenticated users.
 * Limits: 30 requests per 30 seconds, blocks for 3 minutes.
 */
const authedLimiter = new RateLimiterMemory({
  keyPrefix: "authed-safe-action",
  points: 30, // Number of requests by userId
  duration: 30, // Time window in seconds
  blockDuration: 180, // Block for 3 minutes
});

/**
 * Rate limiter for unauthenticated users.
 * Limits: 10 requests per 30 seconds, blocks for 1 minute.
 */
const unauthedLimiter = new RateLimiterMemory({
  keyPrefix: "unauthed-safe-action",
  points: 10, // Number of requests by IP
  duration: 30, // Time window in seconds
  blockDuration: 60, // Block for 1 minute
});

export { authedLimiter, pageApiLimiter, RateLimiterRes, unauthedLimiter };
