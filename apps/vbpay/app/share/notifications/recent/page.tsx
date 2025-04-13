import { unauthorized } from "next/navigation";
import { RecentShareNotifications } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserRole } from "@/types/user-role";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const REQUIRED_USER_ROLES: UserRole[] = ["read-notifications"];

/**
 * Renders the recent notifications page.
 *
 * This function concurrently checks for user authentication and applies a rate limit based on the current page's pathname.
 * If no authenticated user is found, it returns an unauthorized response.
 * Otherwise, it renders the notifications page within a component that enforces access based on the user's roles.
 *
 * @returns The notifications page component if authentication succeeds; otherwise, an unauthorized response.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: RecentShareNotifications({}) }),
  ]);

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
