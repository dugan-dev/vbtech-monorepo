import {
  authenticatedUser,
  authenticatedUserAttributes,
} from "@/utils/amplify-server-utils";

import { UserAppAttrs } from "@/types/user-app-attrs";

export async function getUserData() {
  const [user, attributes] = await Promise.all([
    authenticatedUser(),
    authenticatedUserAttributes(),
  ]);

  if (!user || !attributes) {
    return {
      isAuthenticated: false,
      userId: null,
      email: null,
      firstName: null,
      lastName: null,
      usersAppAttrs: null,
    };
  }

  const attr = attributes["custom:app1:attrs"];
  const parsed = attr ? JSON.parse(attr) : null;
  const usersAppAttrs: UserAppAttrs = parsed as UserAppAttrs;

  const userId = user.userId;
  const firstName = attributes.given_name;
  const lastName = attributes.family_name;
  const email = attributes.email;

  return {
    isAuthenticated: true,
    userId,
    email,
    firstName,
    lastName,
    usersAppAttrs,
  };
}
