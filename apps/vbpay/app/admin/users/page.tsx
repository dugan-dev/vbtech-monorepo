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
 * Renders the Admin Users management page with authentication and rate limiting.
 *
 * This server-side function concurrently checks if the user is authenticated and enforces a page access rate limit.
 * If the user is not authenticated, an unauthorized response is returned. Otherwise, it displays the user management
 * interface, restricting access to allowed user types for administrative purposes.
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
