import "server-only";

import { unauthorized } from "next/navigation";
import { BeneficiariesSearch } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the Beneficiary Search page.
 *
 * This asynchronous function concurrently checks for an authenticated user and verifies that the request is within 
 * the allowed rate limits. If no authenticated user is found, it returns an unauthorized response. Otherwise, it 
 * renders a restricted page component that displays the Beneficiary Search interface for users with allowed attributes.
 *
 * @returns A JSX element representing the Beneficiary Search page or an unauthorized response.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: BeneficiariesSearch({}) }),
  ]);

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <h1>Beneficiary Search</h1>
    </RestrictByUserAppAttrsServer>
  );
}
