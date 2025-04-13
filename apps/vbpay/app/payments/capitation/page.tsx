import "server-only";

import { unauthorized } from "next/navigation";
import { PaymentsCapitation } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the Capitation Payments page with access restrictions.
 *
 * This asynchronous component concurrently verifies the user's authentication status and checks the page's rate limit. If the user is not authenticated, it returns an unauthorized response. Otherwise, it renders the Capitation Payments content within a restricted layout that limits access to specific user types.
 *
 * @returns A React element representing the Capitation Payments page if authenticated, or an unauthorized response.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: PaymentsCapitation({}) }),
  ]);

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <h1>Capitation Payments</h1>
    </RestrictByUserAppAttrsServer>
  );
}
