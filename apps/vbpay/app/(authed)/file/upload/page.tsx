import "server-only";

import { unauthorized } from "next/navigation";
import { FileUpload } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the File Upload page with concurrent rate limiting and authentication checks.
 *
 * This asynchronous component concurrently checks the rate limit for the file upload pathname and retrieves
 * the authenticated user. If no authenticated user is found, it returns an unauthorized response. Otherwise,
 * it renders the File Upload interface within a restricted access wrapper that enforces allowed user types.
 *
 * @returns The rendered File Upload page for authenticated and authorized users, or an unauthorized response.
 */
export default async function Page() {
  // Check rate limiter
  const user = await authenticatedUser();
  await checkPageRateLimit({ pathname: FileUpload({}), user });

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <h1>File Upload</h1>
    </RestrictByUserAppAttrsServer>
  );
}
