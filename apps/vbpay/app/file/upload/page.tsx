import "server-only";

import { unauthorized } from "next/navigation";
import { FileUpload } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the file upload page.
 *
 * This asynchronous server component concurrently checks the user's authentication status and enforces a rate limit based on the file upload route. If the user is not authenticated, it returns an unauthorized response. Otherwise, it displays the file upload interface within a component that restricts access to specific allowed user types.
 *
 * @returns The restricted file upload page as a React component or an unauthorized response.
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
