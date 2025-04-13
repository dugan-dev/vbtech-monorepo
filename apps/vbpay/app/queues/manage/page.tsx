import "server-only";

import { unauthorized } from "next/navigation";
import { QueuesManage } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo"];

/**
 * Renders a server-side page for managing user queues.
 *
 * This asynchronous function concurrently verifies the user's authentication status and enforces a page rate limit. If no authenticated user is found, it returns an unauthorized response. Otherwise, it renders a restricted component that grants access only to specific user types and displays the "Manage Queues" header.
 *
 * @returns A React component representing the queues management page or an unauthorized response.
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
