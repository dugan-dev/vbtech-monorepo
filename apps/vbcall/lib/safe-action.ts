import "server-only";

import { headers } from "next/headers";
import { getUsersData } from "@/repos/user-repository";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { createSafeActionClient } from "next-safe-action";
import z from "zod";

import {
  authedLimiter,
  RateLimiterRes,
  unauthedLimiter,
} from "@workspace/ui/lib/rate-limiter-flexible";
import { getClientIP } from "@workspace/ui/utils/get-client-ip";
import { getRateLimitWaitTimeMessage } from "@workspace/ui/utils/rate-limit/get-rate-limit-wait-time-message";

import { UserTypeEnum } from "@/types/user-type";

const unauthedActionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
  // Can also be an async function.
  handleServerError(e, utils) {
    const { clientInput, metadata } = utils;

    // Log to console.
    console.error(
      `Action error: ${metadata?.actionName}`,
      e.message,
      clientInput,
    );

    return e.message;
  },
}).use(async ({ next, metadata }) => {
  const headerList = await headers();
  const plainHeaders = Object.fromEntries(headerList.entries());
  const ip = getClientIP(plainHeaders);

  if (!ip) {
    throw new Error("Could not determine client IP address for rate limiting.");
  }

  // throw error if rate limit exceeded
  await unauthedLimiter.consume(ip).catch((error: RateLimiterRes) => {
    const msBeforeNext = error.msBeforeNext;
    const waitTimeMessage = getRateLimitWaitTimeMessage(msBeforeNext);

    console.error(
      `Action error: ${metadata?.actionName}`,
      `Rate limit exceeded. Try again in ${waitTimeMessage}.`,
    );

    throw new Error(
      `Action rate limit exceeded. Please try again in ${waitTimeMessage}. Action: ${metadata?.actionName}`,
    );
  });

  return await next();
});

const authedActionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
      allowedTypes: z.array(UserTypeEnum).optional(),
      adminOnly: z.boolean().optional(),
    });
  },
  // Can also be an async function.
  handleServerError(e, utils) {
    const { clientInput, metadata } = utils;

    // Log to console.
    console.error(
      `Action error: ${metadata?.actionName}`,
      e.message,
      clientInput,
    );

    return e.message;
  },
}).use(async ({ next, metadata }) => {
  const { allowedTypes, adminOnly } = metadata;
  // get user auth data
  const user = await authenticatedUser();
  const { usersAppAttrs, email, firstName, lastName } = await getUsersData({
    userId: user?.userId || "",
  });

  // throw error if no user id
  if (!user || !user.userId || !usersAppAttrs) {
    console.error(
      `Action error: ${metadata?.actionName}`,
      "User not authenticated.",
    );
    throw new Error(`User not authenticated. Action: ${metadata?.actionName}`);
  }

  // throw error if rate limit exceeded
  await authedLimiter.consume(user.userId).catch((error: RateLimiterRes) => {
    const msBeforeNext = error.msBeforeNext;
    const waitTimeMessage = getRateLimitWaitTimeMessage(msBeforeNext);
    console.error(
      `Action error: ${metadata?.actionName}`,
      `Rate limit exceeded. Try again in ${waitTimeMessage}.`,
    );

    throw new Error(
      `Action rate limit exceeded. Please try again in ${waitTimeMessage}. Action: ${metadata?.actionName}`,
    );
  });

  // throw error if user not allowed
  if (allowedTypes && !allowedTypes.includes(usersAppAttrs.type)) {
    console.error(
      `Action error: ${metadata?.actionName}`,
      "User not authorized. User type not allowed.",
    );
    throw new Error(
      `User not authorized. User type not allowed. Action: ${metadata?.actionName}`,
    );
  }

  // throw error if user not admin
  if (adminOnly && !usersAppAttrs.admin) {
    console.error(
      `Action error: ${metadata?.actionName}`,
      "User not authorized. User not admin.",
    );
    throw new Error(
      `User not authorized. User not admin. Action: ${metadata?.actionName}`,
    );
  }

  return await next({
    ctx: { userId: user.userId, usersAppAttrs, email, firstName, lastName },
  });
});

export { authedActionClient, unauthedActionClient };
