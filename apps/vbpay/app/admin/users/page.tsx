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
 * Renders the admin user management page with enforced user access restrictions.
 *
 * This asynchronous server component concurrently authenticates the user and checks the page's rate limit.
 * If the user is not authenticated, it returns an unauthorized response. Otherwise, it restricts access based on
 * allowed user types (e.g., "bpo") and renders the user management interface.
 *
 * @example
 * // Used as a Next.js server component for the admin users route.
 * export default async function Page();
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
