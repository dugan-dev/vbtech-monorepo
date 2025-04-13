import "server-only";

import { unauthorized } from "next/navigation";
import { FileStatus } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the File Status page after validating user authentication and rate limits.
 *
 * This asynchronous function concurrently checks for an authenticated user and verifies that the page rate limit is not exceeded.
 * If no authenticated user is found, it returns an unauthorized response. When authentication is successful,
 * it renders the File Status page within a component that restricts access based on allowed user types.
 *
 * @returns A React element representing the File Status page or an unauthorized response.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: FileStatus({}) }),
  ]);

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <h1>File Status</h1>
    </RestrictByUserAppAttrsServer>
  );
}
