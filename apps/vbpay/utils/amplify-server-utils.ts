import { createServerRunner, NextServer } from "@aws-amplify/adapter-nextjs";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth/server";

import { authConfig } from "@/lib/auth/config";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: {
    Auth: authConfig,
  },
});

export async function authenticatedUser(context: NextServer.Context) {
  return await runWithAmplifyServerContext({
    nextServerContext: context,
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        console.log("session");
        console.log(session);
        if (!session.tokens) {
          return undefined;
        }

        const user = await getCurrentUser(contextSpec);
        console.log("user");
        console.log(user);

        return user;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
  });
}
