import "server-only";

import { revalidateTag } from "next/cache";
import { env } from "@/env/server";
import { USERS_DATA_CACHE_TAG } from "@/repos/user-repository";
import {
  AdminCreateUserCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserCognito } from "@/types/user-cognito";
import { cognitoClient } from "@/lib/auth/cognito";

import { generateTempPassword } from "../utils/generate-temp-password";

const limit = 60;

// List users function
async function getAllUsers() {
  const command = new ListUsersCommand({
    UserPoolId: env.AWS_COGNITO_USER_POOL_ID,
    Limit: limit,
  });

  try {
    const response = await cognitoClient.send(command);
    const users: UserCognito[] = (response?.Users || []).map((user) => {
      // Find attributes safely
      const findAttr = (name: string) =>
        user.Attributes?.find((attr) => attr.Name === name)?.Value || "";

      let hasAppAttrs = false;
      // Parse app attributes safely
      let appAttrs: UserAppAttrs = {
        app: "",
        super: false,
        admin: false,
        type: "internal", // Default value from UserType
      };

      try {
        const appAttrsStr = findAttr("custom:app3:attrs");
        if (appAttrsStr) {
          hasAppAttrs = true;
          appAttrs = JSON.parse(appAttrsStr) as UserAppAttrs;
        }
      } catch (e) {
        console.error("Error parsing app attributes:", e);
      }

      return {
        userId: user.Username!, // The non-null assertion operator ensures this is treated as a string
        email: findAttr("email"),
        firstName: findAttr("given_name"),
        lastName: findAttr("family_name"),
        appAttrs: hasAppAttrs ? appAttrs : undefined,
        accountStatus: user.Enabled ? "ENABLED" : "DISABLED",
        confirmationStatus: user.UserStatus || "UNKNOWN",
        createdAt: user.UserCreateDate || new Date(),
        lastUpdatedAt: user.UserLastModifiedDate || new Date(),
      };
    });

    return users;
  } catch (error) {
    console.error("Error listing users:", error);
    throw new Error(
      `Failed to list users: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

// Admin create user function
async function createUser(
  email: string,
  firstName: string,
  lastName: string,
  appAttrs: UserAppAttrs,
) {
  const command = new AdminCreateUserCommand({
    UserPoolId: env.AWS_COGNITO_USER_POOL_ID,
    Username: email,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
      {
        Name: "given_name",
        Value: firstName,
      },
      {
        Name: "family_name",
        Value: lastName,
      },
      {
        Name: "custom:app2:attrs",
        Value: JSON.stringify(appAttrs),
      },
    ],
  });

  try {
    const response = await cognitoClient.send(command);
    return response.User;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

/**
 * Updates an existing user's attributes in the AWS Cognito user pool.
 *
 * This function sends an update command to modify a user's email, first name, last name, and custom application attributes.
 * The email is automatically marked as verified.
 *
 * @param email - The new email address for the user.
 * @param firstName - The new given name for the user.
 * @param lastName - The new family name for the user.
 * @param appAttrs - A set of custom application attributes.
 * @param userId - The Cognito username of the user to update.
 * @returns A promise resolving to the response from the Cognito client.
 *
 * @throws {Error} If the update operation fails.
 */
async function editUser(
  email: string,
  firstName: string,
  lastName: string,
  appAttrs: UserAppAttrs,
  userId: string,
) {
  const command = new AdminUpdateUserAttributesCommand({
    UserPoolId: env.AWS_COGNITO_USER_POOL_ID,
    Username: userId,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
      {
        Name: "given_name",
        Value: firstName,
      },
      {
        Name: "family_name",
        Value: lastName,
      },
      {
        Name: "custom:app2:attrs",
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

/**
 * Disables a user account in the Cognito user pool.
 *
 * Constructs and sends an AdminDisableUserCommand using the given user identifier. If the operation fails,
 * the error is logged and rethrown.
 *
 * @param userId - The unique identifier of the user to disable.
 * @returns The response from AWS Cognito after successfully disabling the user.
 * @throws {Error} If the operation to disable the user fails.
 */
async function disableUser(userId: string) {
  const command = new AdminDisableUserCommand({
    UserPoolId: env.AWS_COGNITO_USER_POOL_ID,
    Username: userId,
  });

  try {
    await cognitoClient.send(command);
    revalidateTag(USERS_DATA_CACHE_TAG + "-" + userId);
  } catch (error) {
    console.error("Error disabling existing user:", error);
    throw error;
  }
}

/**
 * Enables a disabled user account in the Cognito user pool.
 *
 * This function sends an AdminEnableUserCommand using the provided user identifier to activate a previously disabled account. It returns the response from the Cognito client upon success.
 *
 * @param userId The identifier of the user to enable.
 * @returns The response from the Cognito client after enabling the user.
 * @throws {Error} If the Cognito client fails to enable the user.
 */
async function enableUser(userId: string) {
  const command = new AdminEnableUserCommand({
    UserPoolId: env.AWS_COGNITO_USER_POOL_ID,
    Username: userId,
  });

  try {
    await cognitoClient.send(command);
    revalidateTag(USERS_DATA_CACHE_TAG + "-" + userId);
  } catch (error) {
    console.error("Error enabling existing user:", error);
    throw error;
  }
}

/**
 * Resets the specified user's password by generating a temporary password and requiring a password change on next login.
 *
 * This function creates a temporary password, updates the user's password in the Cognito user pool by marking it as non-permanent,
 * and returns the temporary password. The user will be required to change this password upon their next login.
 *
 * @param userId - The identifier of the user whose password is being reset.
 * @returns An object containing the temporary password as `tempPass`.
 * @throws {Error} If the password reset operation fails.
 */
async function forceChangePassword(userId: string) {
  const tempPass = generateTempPassword();
  const command = new AdminSetUserPasswordCommand({
    UserPoolId: env.AWS_COGNITO_USER_POOL_ID,
    Username: userId,
    Password: tempPass,
    Permanent: false, // Ensures user is forced to change their password on next login.
  });

  try {
    await cognitoClient.send(command);
    revalidateTag(USERS_DATA_CACHE_TAG + "-" + userId);
    return { tempPass };
  } catch (error) {
    console.error("Error resetting user password:", error);
    throw error;
  }
}

export {
  createUser,
  disableUser,
  editUser,
  enableUser,
  getAllUsers,
  forceChangePassword,
};
