import "server-only";

import { unauthorized } from "next/navigation";
import { BeneficiariesAlignment } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the Beneficiary Alignment page on the server with concurrent user authentication and rate limiting.
 *
 * This asynchronous component verifies the user's authentication and applies a rate limit check based on the current pathname.
 * If the user is not authenticated, it returns an unauthorized response; otherwise, it renders the Beneficiary Alignment page
 * with access restricted by allowed user types.
 *
 * @returns A JSX element representing the restricted Beneficiary Alignment page, or an unauthorized response when the user is not authenticated.
 */
export default async function Page() {
  // Check rate limiter
  const user = await authenticatedUser();
  await checkPageRateLimit({ pathname: BeneficiariesAlignment({}), user });

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <h1>Beneficiary Alignment</h1>
    </RestrictByUserAppAttrsServer>
  );
}
