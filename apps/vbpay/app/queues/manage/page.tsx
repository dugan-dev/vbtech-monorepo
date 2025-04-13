import "server-only";

import { unauthorized } from "next/navigation";
import { QueuesManage } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo"];

/**
 * Renders the Manage Queues page after concurrently verifying user authentication and rate limit.
 *
 * This asynchronous function performs a concurrent check using both the user authentication and page rate limit utilities.
 * If no authenticated user is found, it returns an unauthorized response. Otherwise, it renders a page component that
 * restricts access to allowed user types with an administrative access requirement.
 *
 * @returns The rendered Manage Queues page component if the user is authenticated and authorized; otherwise, an unauthorized response.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: QueuesManage({}) }),
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
      <h1>Manage Queues</h1>
    </RestrictByUserAppAttrsServer>
  );
}
