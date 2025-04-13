import "server-only";

import { unauthorized } from "next/navigation";
import { BeneficiariesAlignment } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the Beneficiary Alignment page.
 *
 * Concurrently checks the page rate limit and authenticates the user. If the user is not authenticated,
 * it returns an unauthorized response. Otherwise, it renders the page content within a component that
 * restricts access based on allowed user attributes.
 *
 * @returns The rendered page for authenticated users or an unauthorized response if authentication fails.
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
