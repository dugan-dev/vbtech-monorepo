import { cache } from "react";
import { cookies } from "next/headers";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import type { ResourcesConfig } from "aws-amplify";
import { getCurrentUser } from "aws-amplify/auth/server";

import { authConfig } from "../auth/config";

export function createAmplifyServerUtils(
  authConfigParam: ResourcesConfig["Auth"],
): {
  runWithAmplifyServerContext: ReturnType<
    typeof createServerRunner
  >["runWithAmplifyServerContext"];
  authenticatedUser: () => Promise<
    Awaited<ReturnType<typeof getCurrentUser>> | undefined
  >;
} {
  const { runWithAmplifyServerContext } = createServerRunner({
    config: {
      Auth: authConfigParam,
    },
  });

  // Wrap with React's cache for request deduplication
  const authenticatedUser = cache(async () => {
    return await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: async (contextSpec) => {
        try {
          const user = await getCurrentUser(contextSpec);
          return user;
        } catch {
          return undefined;
        }
      },
    });
  });

  return {
    runWithAmplifyServerContext,
    authenticatedUser,
  };
}

// Since both apps use the same auth config, export configured utilities directly
export const { runWithAmplifyServerContext, authenticatedUser } =
  createAmplifyServerUtils(authConfig);
