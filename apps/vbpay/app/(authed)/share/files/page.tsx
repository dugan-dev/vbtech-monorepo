import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { RateLimit } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { getClientIpFromHeaders } from "@workspace/ui/utils/get-client-ip";
import { checkPageRateLimit } from "@workspace/ui/utils/rate-limit/check-page-rate-limit";

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
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({
      pathname: "/share/files",
      config: {
        getHeaders: headers,
        redirect,
        getRateLimitRoute: () => RateLimit({}),
        authenticatedUser,
        getClientIp: getClientIpFromHeaders,
      },
    }),
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
