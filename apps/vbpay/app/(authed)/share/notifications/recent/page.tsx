import { unauthorized } from "next/navigation";
import { RecentShareNotifications } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

import { UserRole } from "@/types/user-role";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const REQUIRED_USER_ROLES: UserRole[] = ["read-notifications"];

/**
 * Renders the Recent Notifications page.
 *
 * This asynchronous function concurrently verifies user authentication and enforces rate limiting for the page.
 * If no authenticated user is found, it returns an unauthorized response.
 * Otherwise, it returns a React element that wraps the notifications content within a component enforcing the required user roles.
 *
 * @returns A React element displaying recent notifications for an authenticated user, or an unauthorized response.
 */
export default async function Page() {
  // Check rate limiter
  const user = await authenticatedUser();
  await checkPageRateLimit({ pathname: RecentShareNotifications({}), user });

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      userId={user.userId}
      requiredUserRoles={REQUIRED_USER_ROLES}
    >
      <h1>Recent Notifications</h1>
    </RestrictByUserAppAttrsServer>
  );
}
