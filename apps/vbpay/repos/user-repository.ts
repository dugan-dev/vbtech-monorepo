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

// Create the inner function that uses unstable_cache for time-based caching
const getUserDataFromCache = (userId: string) => {
  const cacheKey = `${USERS_DATA_CACHE_TAG}-${userId}`;

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
 * Updates the user's selection slug attribute in AWS Cognito.
 *
 * Retrieves the current user attributes, merges them with the new payer public ID as the slug, and sends an update command to Cognito.
 * On a successful update, the function revalidates the related cache tag. If the update fails, it logs the error and rethrows the exception.
 *
 * @param userId - The identifier of the user to update.
 * @param payerPubId - The new selection slug value to assign.
 *
 * @throws {Error} When the update operation fails in AWS Cognito.
 */
export async function updateUserSelectionSlug(
  userId: string,
  payerPubId: string,
) {
  const usersData = await getUsersData({ userId });

  // Update user attributes with new payerPubId
  const appAttrs: UserAppAttrs = {
    slug: payerPubId,
    ...usersData.usersAppAttrs,
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
    revalidateTag(USERS_DATA_CACHE_TAG + "-" + userId);
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
