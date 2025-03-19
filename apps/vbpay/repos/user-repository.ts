import { unstable_cache as cache } from "next/cache";
import {
  authenticatedUser,
  authenticatedUserAttributes,
} from "@/utils/amplify-server-utils";

import { UserAppAttrs } from "@/types/user-app-attrs";

const USER_DATA_CACHE_KEY = "userDataCacheKey";
let uId = "";

// Move the authentication outside the cached function
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

  uId = user.userId;
  const attr = attributes["custom:app1:attrs"];
  const parsed = attr ? JSON.parse(attr) : null;
  const parsedTyped: UserAppAttrs = parsed as UserAppAttrs;
  const firstName = attributes.given_name;
  const lastName = attributes.family_name;
  const email = attributes.email;
  // Now call the cached function with the data you've already retrieved
  return getCachedUserData(
    email || "",
    firstName || "",
    lastName || "",
    parsedTyped,
  );
}

// Cache the processing of the data, not the fetching
const getCachedUserData = cache(
  async (
    email: string,
    firstName: string,
    lastName: string,
    usersAppAttrs: UserAppAttrs,
  ) => {
    return {
      isAuthenticated: true,
      userId: uId,
      email,
      firstName,
      lastName,
      usersAppAttrs,
    };
  },
  [USER_DATA_CACHE_KEY],
  {
    revalidate: 600,
    tags: [USER_DATA_CACHE_KEY + uId],
  },
);

export { USER_DATA_CACHE_KEY };
