import "server-only";

import { headers } from "next/headers";
import { getUsersData } from "@/repos/user-repository";
import { getRateLimitWaitTimeMessage } from "@/utils/get-rate-limit-wait-time-message";
import { createSafeActionClient } from "next-safe-action";
import { RateLimiterRes } from "rate-limiter-flexible";
import z from "zod";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";
import { getClientIp } from "@workspace/auth/lib/utils/get-client-ip";
import {
  authedLimiter,
  unauthedLimiter,
} from "@workspace/auth/lib/utils/rate-limiter-flexible";

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
  const ip = getClientIp(headerList);

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
