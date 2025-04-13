import "server-only";

import { unauthorized } from "next/navigation";
import { PaymentsPerformance } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the Value Based Payments page for authenticated users.
 *
 * This asynchronous function concurrently verifies the user's authentication status and applies a rate limit check.
 * If the user is not authenticated, it returns an unauthorized response. Otherwise, it renders a restricted server component
 * that displays the Value Based Payments content for users whose roles are included in the allowed user types.
 *
 * @returns A server-rendered element representing either an unauthorized response or the Value Based Payments page.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: PaymentsPerformance({}) }),
  ]);

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <h1>Value Based Payments</h1>
    </RestrictByUserAppAttrsServer>
  );
}
