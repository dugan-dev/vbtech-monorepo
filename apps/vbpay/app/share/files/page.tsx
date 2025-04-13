import { unauthorized } from "next/navigation";
import { ShareFiles } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserRole } from "@/types/user-role";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const REQUIRED_USER_ROLES: UserRole[] = ["read-files"];

/**
 * Renders the "Share Files" page.
 *
 * Concurrently verifies user authentication and rate limits for accessing the file-sharing route.
 * If the user is not authenticated or rate limited, it returns an unauthorized response.
 * Otherwise, it renders content restricted to users with the required roles.
 *
 * @returns The page component for authorized users or an unauthorized response.
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
