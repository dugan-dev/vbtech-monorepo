import { RateLimit } from "@/routes";

import { createStandardRateLimiting } from "@workspace/auth/lib/utils/standard-rate-limiting";

// Create configured rate limiting functions using shared standard configuration
const { checkPageRateLimit, checkApiRateLimit } =
  createStandardRateLimiting(RateLimit);

export { checkPageRateLimit, checkApiRateLimit };
