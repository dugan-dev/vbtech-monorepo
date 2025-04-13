import "server-only";

import { unauthorized } from "next/navigation";
import { BeneficiariesSearch } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the Beneficiary Search page for authenticated users.
 *
 * This asynchronous server-side component concurrently validates user authentication and enforces rate limiting
 * using the beneficiary search pathname. If no authenticated user is found, it returns an unauthorized response.
 * Otherwise, it renders the page wrapped in a component that restricts access based on allowed user types.
 *
 * @returns A JSX element for the beneficiary search interface when the user is authenticated, or an unauthorized response.
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
