import "server-only";

import { unauthorized } from "next/navigation";
import { FileStatus } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the File Status page for authenticated users.
 *
 * This server-side component concurrently verifies user authentication and enforces a rate limit
 * on the current page. If the user is not authenticated, it returns an unauthorized response.
 * Otherwise, it renders the File Status content within a component that restricts access based on
 * allowed user types.
 *
 * @returns A restricted File Status page element for authenticated users, or an unauthorized response.
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
