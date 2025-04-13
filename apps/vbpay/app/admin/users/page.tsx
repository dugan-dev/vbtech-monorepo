import { UserManagement } from "./component/user-management";

import "server-only";

import { unauthorized } from "next/navigation";
import { AdminUsers } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo"];

/**
 * Renders the admin users management page.
 *
 * This asynchronous function concurrently authenticates the user and enforces the page rate limit.
 * If the user is not authenticated, it returns an unauthorized response.
 * Otherwise, it renders the UserManagement component within a restricted layout that only permits access for allowed user types with admin privileges.
 *
 * @returns A React element representing the admin users page or an unauthorized response.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: AdminUsers({}) }),
  ]);

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
      adminOnly
    >
      <UserManagement userId={user.userId} />
    </RestrictByUserAppAttrsServer>
  );
}
