import "server-only";

import { unauthorized } from "next/navigation";
import { BeneficiariesAlignment } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the Beneficiary Alignment page with access control based on user authentication and rate limiting.
 *
 * This asynchronous server-side component concurrently performs user authentication and a rate limiting check. 
 * If the user is not authenticated, it returns an unauthorized response. When the user is valid, it renders the 
 * Beneficiary Alignment view within a restricted access wrapper that permits only specific user types.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: BeneficiariesAlignment({}) }),
  ]);

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
