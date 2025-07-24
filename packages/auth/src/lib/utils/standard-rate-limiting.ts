import { pageApiLimiter } from "./rate-limiter-flexible";
import {
  createCheckApiRateLimit,
  createCheckPageRateLimit,
} from "./rate-limiting";

/**
 * Creates standard rate limiting functions for apps that follow the VBTech pattern.
 *
 * This assumes the app has:
 * - A RateLimit route function that takes { secs } and returns a URL string
 * - Standard rate limiting requirements (30 requests per 30 seconds)
 *
 * @param rateLimitRoute - The app's RateLimit route function
 * @returns Object with checkPageRateLimit and checkApiRateLimit functions
 */
export function createStandardRateLimiting(
  rateLimitRoute: (params: { secs: number }) => string,
) {
  const checkPageRateLimit = createCheckPageRateLimit({
    rateLimiter: pageApiLimiter(),
    rateLimitRoute,
  });

  const checkApiRateLimit = createCheckApiRateLimit({
    rateLimiter: pageApiLimiter(),
  });

  return { checkPageRateLimit, checkApiRateLimit };
}
