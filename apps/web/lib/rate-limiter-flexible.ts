import { RateLimiterMemory } from "rate-limiter-flexible";

const pageApiLimiter = new RateLimiterMemory({
  keyPrefix: "page-api",
  points: 30, // Number of requests by userId or IP
  duration: 30, // Time window in seconds
  blockDuration: 60, // Block for 1 minute
});

export { pageApiLimiter };
