import "server-only";

import { unauthorized } from "next/navigation";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { createSafeActionClient } from "next-safe-action";
import z from "zod";

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
});

const authedActionClient = createSafeActionClient({
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
  // get user auth data
  const user = await authenticatedUser();

  // throw error if no user id
  if (!user) {
    console.error(
      `Action error: ${metadata?.actionName}`,
      "User not authenticated.",
    );
    unauthorized();
  }

  return await next({ ctx: { userId: user.userId } });
});

export { authedActionClient, unauthedActionClient };
