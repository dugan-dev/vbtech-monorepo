import "server-only";

import { unauthorized } from "next/navigation";
import { FileUpload } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the File Upload page for authenticated users who meet rate limiting and access restrictions.
 *
 * This asynchronous function checks both the user's authentication status and the page's rate limit concurrently.
 * If the user is not authenticated, an unauthorized response is returned. When a valid user is found, the function
 * renders the file upload interface within a component that restricts access based on allowed user types.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: FileUpload({}) }),
  ]);

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
