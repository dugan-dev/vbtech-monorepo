import "server-only";

import { unstable_cache as cache } from "next/cache";
import { AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";

import { UserAppAttrs } from "@/types/user-app-attrs";
import { cognitoClient } from "@/lib/auth/cognito";

type props = {
  userId: string;
};

// Define a constant for the cache tag prefix
export const USERS_DATA_CACHE_TAG = "users-data";
const REVALIDATE_SECONDS = 600; // 10 minutes

export function getUsersData({ userId }: props) {
  const cacheKey = `${USERS_DATA_CACHE_TAG}-${userId}`;

  // The cache function returns a function that needs to be executed
  const cachedFn = cache(
    async () => {
      const command = new AdminGetUserCommand({
        UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
        Username: userId,
      });

      const response = await cognitoClient.send(command);

      const appAttrs = response.UserAttributes?.find(
        (attr) => attr.Name === "custom:app1:attrs",
      );
      const lastName = response.UserAttributes?.find(
        (attr) => attr.Name === "family_name",
      );
      const firstName = response.UserAttributes?.find(
        (attr) => attr.Name === "given_name",
      );
      const email = response.UserAttributes?.find(
        (attr) => attr.Name === "email",
      );

      const usersAppAttrs: UserAppAttrs = appAttrs?.Value
        ? JSON.parse(appAttrs.Value)
        : {};

      return {
        usersAppAttrs,
        firstName: firstName?.Value,
        lastName: lastName?.Value,
        email: email?.Value,
      };
    },
    [cacheKey],
    { revalidate: REVALIDATE_SECONDS, tags: [cacheKey] },
  );

  // Return the cached function which will be executed when called
  return cachedFn();
}
