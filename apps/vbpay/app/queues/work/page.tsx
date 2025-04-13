import "server-only";

import { unauthorized } from "next/navigation";
import { QueuesWork } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo"];

/**
 * Renders the "Work by Queue" page with authentication and rate limit checks.
 *
 * This asynchronous function concurrently verifies the user's authentication status and enforces
 * the page's rate limit. If the user is not authenticated, it returns an unauthorized response.
 * Otherwise, it wraps the page content in a restricted access component that allows only specific
 * user types to view the content.
 *
 * @returns A JSX element with restricted content for authenticated users, or an unauthorized response if authentication fails.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: QueuesWork({}) }),
  ]);

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <h1>Work by Queue</h1>
    </RestrictByUserAppAttrsServer>
  );
}
