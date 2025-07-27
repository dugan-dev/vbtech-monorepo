import "server-only";

import { unauthorized } from "next/navigation";
import { QueuesWork } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo"];

/**
 * Renders the work queue page restricted to authenticated users.
 *
 * Concurrently performs a rate limit check and retrieves the authenticated user. If no authenticated user
 * is found, returns an unauthorized response. Otherwise, renders the page content within a component that
 * restricts access to users based on allowed user types.
 *
 * @returns A promise resolving to the restricted work queue page or an unauthorized response.
 */
export default async function Page() {
  // Check rate limiter
  const user = await authenticatedUser();
  await checkPageRateLimit({ pathname: QueuesWork({}), user });

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
