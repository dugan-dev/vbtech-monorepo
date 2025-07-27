import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";

import {
  AUTHED_ACTION_RATE_LIMIT,
  PAGE_RATE_LIMIT,
  UNAUTHED_ACTION_RATE_LIMIT,
} from "../../constants/rate-limits";

// Private variables to hold singleton instances
let _pageApiLimiter: RateLimiterMemory | undefined;
let _authedLimiter: RateLimiterMemory | undefined;
let _unauthedLimiter: RateLimiterMemory | undefined;

// Lazy initialization with singleton pattern
const pageApiLimiter = (): RateLimiterMemory => {
  return (_pageApiLimiter ??= new RateLimiterMemory({
    keyPrefix: "page-api",
    points: PAGE_RATE_LIMIT.POINTS,
    duration: PAGE_RATE_LIMIT.DURATION,
    blockDuration: PAGE_RATE_LIMIT.BLOCK_DURATION,
  }));
};

// Create a rate limiter instance for authenticated users
const authedLimiter = (): RateLimiterMemory => {
  return (_authedLimiter ??= new RateLimiterMemory({
    keyPrefix: "authed-safe-action",
    points: AUTHED_ACTION_RATE_LIMIT.POINTS,
    duration: AUTHED_ACTION_RATE_LIMIT.DURATION,
    blockDuration: AUTHED_ACTION_RATE_LIMIT.BLOCK_DURATION,
  }));
};

// Create a rate limiter instance for unauthenticated users
const unauthedLimiter = (): RateLimiterMemory => {
  return (_unauthedLimiter ??= new RateLimiterMemory({
    keyPrefix: "unauthed-safe-action",
    points: UNAUTHED_ACTION_RATE_LIMIT.POINTS,
    duration: UNAUTHED_ACTION_RATE_LIMIT.DURATION,
    blockDuration: UNAUTHED_ACTION_RATE_LIMIT.BLOCK_DURATION,
  }));
};

export {
  pageApiLimiter,
  authedLimiter,
  unauthedLimiter,
  RateLimiterRes,
  PAGE_RATE_LIMIT,
  AUTHED_ACTION_RATE_LIMIT,
  UNAUTHED_ACTION_RATE_LIMIT,
};
