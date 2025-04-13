import "server-only";

import { unauthorized } from "next/navigation";
import { BeneficiariesAttribution } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the beneficiary attribution page for authenticated users.
 *
 * This asynchronous server component concurrently verifies the user's authentication status and checks the page's rate limit. If the user is not authenticated, it returns an unauthorized response. If authenticated, it displays the beneficiary attribution content within an access-restricted wrapper that permits only specific user types.
 *
 * @returns The beneficiary attribution page for authorized users, or an unauthorized response if the user is not authenticated.
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
