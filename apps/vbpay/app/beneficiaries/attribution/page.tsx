import "server-only";

import { unauthorized } from "next/navigation";
import { BeneficiariesAttribution } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the Beneficiary Attribution page for authenticated users.
 *
 * This server-side function concurrently performs a user authentication check and a rate limit check.
 * If no authenticated user is found, it returns an unauthorized response. Otherwise, it renders the page
 * content wrapped in a component that restricts access based on allowed user types.
 *
 * @returns A React component for the Beneficiary Attribution page, or an unauthorized response.
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
