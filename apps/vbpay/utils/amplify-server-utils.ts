import { cookies } from "next/headers";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { getCurrentUser } from "aws-amplify/auth/server";

import { authConfig } from "@/lib/auth/config";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: {
    Auth: authConfig,
  },
});

export async function authenticatedUser() {
  return await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        const user = await getCurrentUser(contextSpec);
        return user;
      } catch (error) {
        return undefined;
      }
    },
  });
}
