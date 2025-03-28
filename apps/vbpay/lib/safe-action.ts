import "server-only";

import { forbidden, unauthorized } from "next/navigation";
import { getUsersData } from "@/repos/user-repository";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { createSafeActionClient } from "next-safe-action";
import z from "zod";

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
    unauthorized();
  }

  // throw error if user not allowed
  if (allowedTypes && !allowedTypes.includes(usersAppAttrs.type)) {
    console.error(
      `Action error: ${metadata?.actionName}`,
      "User not authorized. User type not allowed.",
    );
    forbidden();
  }

  // throw error if user not admin
  if (adminOnly && !usersAppAttrs.admin) {
    console.error(
      `Action error: ${metadata?.actionName}`,
      "User not authorized. User not admin.",
    );
    forbidden();
  }

  return await next({
    ctx: { userId: user.userId, usersAppAttrs, email, firstName, lastName },
  });
});

export { authedActionClient, unauthedActionClient };
