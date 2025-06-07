import "server-only";

import { env } from "process";
import { cache } from "react";
import { revalidateTag, unstable_cache as timedCache } from "next/cache";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { formatMarketingAndRefName } from "@/utils/format-marketing-name-and-ref-name";
import {
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { ComboItem } from "@workspace/ui/types/combo-item";

import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserSelectionData } from "@/types/user-selection-data";
import { cognitoClient } from "@/lib/auth/cognito";

import { getAllPayers } from "./payer-repository";

type props = {
  userId: string;
};

// Define a constant for the cache tag prefix
export const USERS_DATA_CACHE_TAG = "users-data";
const REVALIDATE_SECONDS = 600; // 10 minutes

// Function to generate consistent cache key for a user
export const getUserCacheKey = (userId: string) =>
  `${USERS_DATA_CACHE_TAG}-${userId}`;

// Create the inner function that uses unstable_cache for time-based caching
const getUserDataFromCache = (userId: string) => {
  const cacheKey = getUserCacheKey(userId);

  return timedCache(
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
  )();
};

// Wrap the function with React's cache for request deduplication
export const getUsersData = cache(async ({ userId }: props) => {
  return getUserDataFromCache(userId);
});

/**
 * Updates the user's custom selection slug attribute in AWS Cognito and revalidates the user's cache.
 *
 * Retrieves the user's current custom app attributes, sets the `slug` property to the provided payer public ID, and updates the attribute in Cognito. After a successful update, the user's cache is revalidated to reflect the change.
 *
 * @param userId - The unique identifier of the user whose selection slug is being updated.
 * @param payerPubId - The new slug value to assign to the user.
 *
 * @throws {Error} If the update operation in AWS Cognito fails.
 */
export async function updateUserSelectionSlug(
  userId: string,
  payerPubId: string,
) {
  const usersData = await getUsersData({ userId });

  // Update user attributes with new payerPubId
  const appAttrs: UserAppAttrs = {
    ...usersData.usersAppAttrs,
    slug: payerPubId,
  };

  const command = new AdminUpdateUserAttributesCommand({
    UserPoolId: env.AWS_COGNITO_USER_POOL_ID,
    Username: userId,
    UserAttributes: [
      {
        Name: "custom:app1:attrs",
        Value: JSON.stringify(appAttrs),
      },
    ],
  });

  try {
    await cognitoClient.send(command);
    revalidateTag(getUserCacheKey(userId));
  } catch (error) {
    console.error("Error editing user:", error);
    throw error;
  }
}

// Wrap with React's cache for request deduplication
export const getUserSelectionData = cache(async () => {
  const user = await authenticatedUser();

  // This Promise.all will benefit from React's cache
  // for request deduplication
  const [payers, usersData] = await Promise.all([
    getAllPayers(),
    getUsersData({ userId: user?.userId || "" }),
  ]);

  if (!payers || !usersData) {
    throw new Error("Failed to load payer or user data");
  }

  const comboItems: ComboItem[] = payers.map((payer) => ({
    label: formatMarketingAndRefName(payer.marketingName, payer.referenceName),
    value: payer.pubId,
  }));

  const userSelectionData: UserSelectionData = {
    defaultLock: usersData.usersAppAttrs.slug !== undefined,
    slug: usersData.usersAppAttrs.slug,
    comboItems,
  };

  return userSelectionData;
});
