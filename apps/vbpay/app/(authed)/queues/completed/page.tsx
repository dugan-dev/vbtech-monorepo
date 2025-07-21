import "server-only";

import { unauthorized } from "next/navigation";
import { QueuesCompleted } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo"];

/**
 * Renders the "Completed Work by Queue" page for authenticated and authorized users.
 *
 * This asynchronous component concurrently checks user authentication and rate limiting.
 * If the user is not authenticated, it returns an unauthorized response. Otherwise, it renders
 * the page content wrapped in a component that restricts access to the allowed user types and enforces
 * administrative privileges.
 *
 * @returns The server-side rendered page for authorized users or an unauthorized response.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: QueuesCompleted({}) }),
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
      <h1>Completed Work by Queue</h1>
    </RestrictByUserAppAttrsServer>
  );
}
