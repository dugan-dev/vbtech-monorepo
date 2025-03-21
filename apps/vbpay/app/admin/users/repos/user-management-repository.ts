import "server-only";

import {
  AdminCreateUserCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { env } from "env/server";

import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserCognito } from "@/types/user-cognito";

const userPoolId = "us-west-2_tTyr5jsaW";
const limit = 60;

const cognitoClient = new CognitoIdentityProviderClient({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    sessionToken: env.AWS_SESSION_TOKEN,
  },
});

// List users function
async function getAllUsers() {
  const command = new ListUsersCommand({
    UserPoolId: userPoolId,
    Limit: limit,
  });

  try {
    const response = await cognitoClient.send(command);
    const users: UserCognito[] = (response?.Users || [])
      .filter((user) => user.Username) // Filter out any users without a Username
      .map((user) => {
        // Find attributes safely
        const findAttr = (name: string) =>
          user.Attributes?.find((attr) => attr.Name === name)?.Value || "";

        // Parse app attributes safely
        let appAttrs: UserAppAttrs = {
          app: "",
          super: false,
          admin: false,
          type: "vendor", // Default value from UserType
        };

        try {
          const appAttrsStr = findAttr("custom:app1:attrs");
          if (appAttrsStr) {
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
          appAttrs,
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
    UserPoolId: userPoolId,
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
        Name: "custom:app1:attrs",
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

// Admin create user function
async function editUser(
  email: string,
  firstName: string,
  lastName: string,
  appAttrs: UserAppAttrs,
  userId: string,
) {
  const command = new AdminUpdateUserAttributesCommand({
    UserPoolId: userPoolId,
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
        Name: "custom:app1:attrs",
        Value: JSON.stringify(appAttrs),
      },
    ],
  });

  try {
    return await cognitoClient.send(command);
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

export { getAllUsers, createUser, editUser };
