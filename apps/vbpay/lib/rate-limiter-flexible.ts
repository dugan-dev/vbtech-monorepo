import { RateLimiterMemory } from "rate-limiter-flexible";

const pageApiLimiter = new RateLimiterMemory({
  keyPrefix: "page-api",
  points: 30, // Number of requests by userId or IP
  duration: 30, // Time window in seconds
  blockDuration: 60, // Block for 1 minute
});

// Create a rate limiter instance for authenticated users
const authedLimiter = new RateLimiterMemory({
  keyPrefix: "authed-safe-action",
  points: 30, // Number of requests by userId
  duration: 30, // Time window in seconds
  blockDuration: 180, // Block for 3 minutes
});

// Create a rate limiter instance for unauthenticated users
const unauthedLimiter = new RateLimiterMemory({
  keyPrefix: "unauthed-safe-action",
  points: 10, // Number of requests by IP
  duration: 30, // Time window in seconds
  blockDuration: 60, // Block for 1 minute
});

export { pageApiLimiter, authedLimiter, unauthedLimiter };
