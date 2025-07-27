import "server-only";

import { unauthorized } from "next/navigation";
import { ManagePaymentRates } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the Manage Rate Sets page for authenticated users with allowed user types, enforcing rate limiting and access restrictions.
 *
 * @returns The page content if the user is authenticated and authorized; otherwise, an unauthorized response.
 */
export default async function Page() {
  // Check rate limiter
  const user = await authenticatedUser();
  await checkPageRateLimit({ pathname: ManagePaymentRates({}), user });

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <h1>Manage Rate Sets</h1>
    </RestrictByUserAppAttrsServer>
  );
}
