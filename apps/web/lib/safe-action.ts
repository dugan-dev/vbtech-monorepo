import "server-only";

import { headers } from "next/headers";
import { getClientIp } from "@/utils/get-client-ip";
import { getRateLimitWaitTimeMessage } from "@/utils/get-rate-limit-wait-time-message";
import { createSafeActionClient } from "next-safe-action";
import { RateLimiterRes } from "rate-limiter-flexible";
import { z } from "zod";

import { pageApiLimiter } from "./rate-limiter-flexible";

const safeActionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
  // Can also be an async function.
  handleServerError(e, utils) {
    const { clientInput, metadata } = utils;

    // Log to console (detailed internal context for debugging).
    console.error(
      `Action error: ${metadata?.actionName}`,
      e.message,
      e.stack,
      clientInput,
    );

    return "An unexpected server error occurred";
  },
}).use(async ({ next, metadata }) => {
  const headerList = await headers();
  const ip = getClientIp(headerList);
  const ipKey = ip ?? "unknown";

  // throw error if rate limit exceeded
  await pageApiLimiter.consume(ipKey).catch((error: RateLimiterRes) => {
    const msBeforeNext = error.msBeforeNext;
    const waitTimeMessage = getRateLimitWaitTimeMessage(msBeforeNext);

    console.error(
      `Action rate limit exceeded: ${metadata?.actionName} - Try again in ${waitTimeMessage}`,
    );

    throw new Error(`Rate limit exceeded. Try again in ${waitTimeMessage}.`);
  });

  return await next();
});

export { safeActionClient };
