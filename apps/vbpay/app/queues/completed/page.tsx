import "server-only";

import { unauthorized } from "next/navigation";
import { QueuesCompleted } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo"];

/**
 * Renders the "Completed Work by Queue" page after verifying the user's identity and enforcing rate limits.
 *
 * This server-side function concurrently checks for an authenticated user and applies a rate limit based on the current page's pathname. If no authenticated user is found, it immediately returns an unauthorized response. Otherwise, it renders a protected component that restricts access to users with allowed attributes, ensuring that only authorized users, particularly administrators, can view the content.
 *
 * @returns A JSX element containing the restricted page content or an unauthorized response.
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
