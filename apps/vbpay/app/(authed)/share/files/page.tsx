import { unauthorized } from "next/navigation";
import { ShareFiles } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

import { UserRole } from "@/types/user-role";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const REQUIRED_USER_ROLES: UserRole[] = ["read-files"];

/**
 * Renders the file-sharing page with access control.
 *
 * This asynchronous page component concurrently checks the user's authentication status and
 * enforces rate limiting based on the current pathname. If the user is not authenticated,
 * it returns an unauthorized response. Otherwise, it renders a component that restricts access
 * to users with the required role, displaying the "Share Files" interface.
 *
 * @returns The Next.js page component for sharing files if the user is authenticated and within
 *          rate limits; an unauthorized response otherwise.
 */
export default async function Page() {
  // Check rate limiter
  const user = await authenticatedUser();
  await checkPageRateLimit({ pathname: ShareFiles({}), user });

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
