import { unauthorized } from "next/navigation";
import { RecentShareNotifications } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserRole } from "@/types/user-role";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const REQUIRED_USER_ROLES: UserRole[] = ["read-notifications"];

/**
 * Renders the page displaying recent notifications for authenticated users.
 *
 * This asynchronous function concurrently checks for user authentication and applies a rate limiting check.
 * If the user is not authenticated, it returns an unauthorized response; otherwise, it renders the notifications
 * page within a component that enforces the required user roles.
 *
 * @example
 * // In a Next.js page:
 * export default async function Page() { ... }
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
