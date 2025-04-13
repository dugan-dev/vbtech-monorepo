import "server-only";

import { unauthorized } from "next/navigation";
import { BeneficiariesAttribution } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the Beneficiary Attribution page with user access restrictions.
 *
 * This asynchronous server component concurrently checks the rate limit and user authentication status.
 * If the user is not authenticated, it returns an unauthorized response. Otherwise, it wraps the page content
 * within a component that enforces access only for allowed user types.
 *
 * @returns A JSX element containing the page content or an unauthorized response based on user authentication.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: BeneficiariesAttribution({}) }),
  ]);

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <h1>Beneficiary Attribution</h1>
    </RestrictByUserAppAttrsServer>
  );
}
