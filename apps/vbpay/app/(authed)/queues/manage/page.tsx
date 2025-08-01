import "server-only";

import { unauthorized } from "next/navigation";
import { QueuesManage } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo"];

/**
 * Renders the Manage Queues page for authenticated and authorized users.
 *
 * This asynchronous function concurrently verifies user authentication and applies a rate limit check. If the authenticated user
 * is not found, it returns an unauthorized response. Otherwise, it renders a restricted component that only permits access for
 * allowed user types and displays the "Manage Queues" header.
 *
 * @returns A React element representing the Manage Queues page or an unauthorized response if access is denied.
 */
export default async function Page() {
  // Check rate limiter
  const user = await authenticatedUser();
  await checkPageRateLimit({ pathname: QueuesManage({}), user });

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
