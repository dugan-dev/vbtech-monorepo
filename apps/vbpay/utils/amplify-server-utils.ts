import { cookies } from "next/headers";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
} from "aws-amplify/auth/server";

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

export async function authenticatedUserAttributes() {
  return await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        const attributes = await fetchUserAttributes(contextSpec);
        return attributes;
      } catch (error) {
        console.error(error);
        return undefined;
      }
    },
  });
}

export async function authenticatedUserSession() {
  return await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);

        if (!session.tokens) {
          return undefined;
        }

        return session;
      } catch (error) {
        return undefined;
      }
    },
  });
}
