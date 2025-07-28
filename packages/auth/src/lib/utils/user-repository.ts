import "server-only";

import { cache } from "react";
import { revalidateTag, unstable_cache as timedCache } from "next/cache";
import {
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
  type CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

import { ComboItem } from "@workspace/ui/types/combo-item";
import { UserSelectionData } from "@workspace/ui/types/user-selection-data";

import { authenticatedUser } from "../server/amplify-server-utils";

export interface UserRepositoryDependencies {
  cognitoClient: CognitoIdentityProviderClient;
  customAttrName: string; // e.g., "custom:app1:attrs" or "custom:app2:attrs"
  userPoolId: string; // AWS Cognito User Pool ID
  getAllItems: () => Promise<ComboItem[]>;
  formatItemLabel?: (item: ComboItem) => string; // Optional formatter for item labels
}

/**
 * Creates a user repository with app-specific dependencies.
 *
 * @param deps - Dependencies including Cognito client, attribute names, and data fetchers
 * @returns An object with user data management functions
 */
export function createUserRepository<TUserAppAttrs = Record<string, unknown>>(
  deps: UserRepositoryDependencies,
) {
  // Define a constant for the cache tag prefix
  const USERS_DATA_CACHE_TAG = "users-data";
  const REVALIDATE_SECONDS = 600; // 10 minutes

  // Function to generate consistent cache key for a user
  const getUserCacheKey = (userId: string) =>
    `${USERS_DATA_CACHE_TAG}-${userId}`;

  // Create the inner function that uses unstable_cache for time-based caching
  const getUserDataFromCache = (userId: string) => {
    const cacheKey = getUserCacheKey(userId);

    return timedCache(
      async () => {
        const command = new AdminGetUserCommand({
          UserPoolId: deps.userPoolId,
          Username: userId,
        });

        const response = await deps.cognitoClient.send(command);

        const appAttrs = response.UserAttributes?.find(
          (attr) => attr.Name === deps.customAttrName,
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

        let usersAppAttrs: TUserAppAttrs = {} as TUserAppAttrs;

        if (appAttrs?.Value) {
          try {
            usersAppAttrs = JSON.parse(appAttrs.Value);
          } catch (error) {
            console.error(
              `Failed to parse user app attributes for user ${userId}:`,
              error,
              `Raw value: ${appAttrs.Value}`,
            );
            usersAppAttrs = {} as TUserAppAttrs;
          }
        }

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
  const getUsersData = cache(async ({ userId }: { userId: string }) => {
    return getUserDataFromCache(userId);
  });

  /**
   * Updates the user's selection slug attribute in AWS Cognito and revalidates the user's cache.
   */
  const updateUserSelectionSlug = async (userId: string, itemPubId: string) => {
    const usersData = await getUsersData({ userId });

    // Update user attributes with new itemPubId
    const appAttrs: TUserAppAttrs = {
      ...usersData.usersAppAttrs,
      slug: itemPubId,
    } as TUserAppAttrs;

    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: deps.userPoolId,
      Username: userId,
      UserAttributes: [
        {
          Name: deps.customAttrName,
          Value: JSON.stringify(appAttrs),
        },
      ],
    });

    try {
      await deps.cognitoClient.send(command);
      revalidateTag(getUserCacheKey(userId));
    } catch (error) {
      console.error("Error editing user:", error);
      throw error;
    }
  };

  // Wrap with React's cache for request deduplication
  const getUserSelectionData = cache(async () => {
    const user = await authenticatedUser();

    if (!user?.userId) {
      throw new Error("User ID is required but not found");
    }

    // This Promise.all will benefit from React's cache
    // for request deduplication
    const [items, usersData] = await Promise.all([
      deps.getAllItems(),
      getUsersData({ userId: user.userId }),
    ]);

    if (!items || !usersData) {
      throw new Error("Failed to load item or user data");
    }

    const comboItems: ComboItem[] = items.map((item) => ({
      label: deps.formatItemLabel ? deps.formatItemLabel(item) : item.label,
      value: item.value,
    }));

    const userSelectionData: UserSelectionData = {
      defaultLock:
        (usersData.usersAppAttrs as Record<string, unknown>).slug !==
          undefined &&
        (usersData.usersAppAttrs as Record<string, unknown>).slug !== null &&
        (usersData.usersAppAttrs as Record<string, unknown>).slug !== "",
      slug: (usersData.usersAppAttrs as Record<string, unknown>).slug as string,
      comboItems,
    };

    return userSelectionData;
  });

  return {
    getUsersData,
    updateUserSelectionSlug,
    getUserSelectionData,
    getUserCacheKey,
    USERS_DATA_CACHE_TAG,
  };
}
