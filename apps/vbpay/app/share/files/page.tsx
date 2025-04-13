import { unauthorized } from "next/navigation";
import { ShareFiles } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserRole } from "@/types/user-role";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const REQUIRED_USER_ROLES: UserRole[] = ["read-files"];

/**
 * Renders the Share Files page for authenticated users with proper rate limiting and access control.
 *
 * This asynchronous server-side function concurrently verifies user authentication and rate limiting. If the user is not authenticated, it returns an unauthorized response. Otherwise, it renders a restricted component that enforces additional access restrictions based on the user's roles, displaying a header with "Share Files".
 *
 * @returns A JSX element representing the Share Files page or an unauthorized response if access is denied.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: ShareFiles({}) }),
  ]);

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      userId={user.userId}
      requiredUserRoles={REQUIRED_USER_ROLES}
    >
      <h1>Share Files</h1>
    </RestrictByUserAppAttrsServer>
  );
}
