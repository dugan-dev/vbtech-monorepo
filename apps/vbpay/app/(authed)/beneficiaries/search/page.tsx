import "server-only";

import { unauthorized } from "next/navigation";
import { BeneficiariesSearch } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the Beneficiary Search page for authenticated users.
 *
 * This server component concurrently checks user authentication and page rate limiting.
 * If no authenticated user is found, it immediately returns an unauthorized response.
 * Otherwise, it renders the "Beneficiary Search" page wrapped in a component that restricts access
 * based on specific allowed user types.
 *
 * @returns A JSX element representing either the restricted Beneficiary Search page for authenticated users or an unauthorized response.
 */
export default async function Page() {
  // Check rate limiter
  const user = await authenticatedUser();
  await checkPageRateLimit({ pathname: BeneficiariesSearch({}), user });

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
