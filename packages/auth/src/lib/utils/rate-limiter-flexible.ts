import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";

// Private variables to hold singleton instances
let _pageApiLimiter: RateLimiterMemory | undefined;
let _authedLimiter: RateLimiterMemory | undefined;
let _unauthedLimiter: RateLimiterMemory | undefined;

// Lazy initialization with singleton pattern
const pageApiLimiter = (): RateLimiterMemory => {
  return (_pageApiLimiter ??= new RateLimiterMemory({
    keyPrefix: "page-api",
    points: 30, // Number of requests by userId or IP
    duration: 30, // Time window in seconds
    blockDuration: 60, // Block for 1 minute
  }));
};

// Create a rate limiter instance for authenticated users
const authedLimiter = (): RateLimiterMemory => {
  return (_authedLimiter ??= new RateLimiterMemory({
    keyPrefix: "authed-safe-action",
    points: 30, // Number of requests by userId
    duration: 30, // Time window in seconds
    blockDuration: 180, // Block for 3 minutes
  }));
};

// Create a rate limiter instance for unauthenticated users
const unauthedLimiter = (): RateLimiterMemory => {
  return (_unauthedLimiter ??= new RateLimiterMemory({
    keyPrefix: "unauthed-safe-action",
    points: 10, // Number of requests by IP
    duration: 30, // Time window in seconds
    blockDuration: 60, // Block for 1 minute
  }));
};

export { pageApiLimiter, authedLimiter, unauthedLimiter, RateLimiterRes };
