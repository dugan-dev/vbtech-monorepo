import "server-only";

import { unauthorized } from "next/navigation";
import { QueuesWork } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo"];

/**
 * Renders the work queue page for authenticated users with rate limiting and access restrictions.
 *
 * This asynchronous function concurrently verifies the user's authentication status and checks that the request
 * complies with the rate limiting policy. If no authenticated user is found, it returns an unauthorized response.
 * Otherwise, it renders the page content within a component that restricts access to permitted user types.
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
