import "server-only";

import { unauthorized } from "next/navigation";
import { PaymentsPerformance } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the Value Based Payments page.
 *
 * This asynchronous function concurrently checks for user authentication and enforces a rate limit based on the current page's pathname. If the user is not authenticated, it returns an unauthorized response. Otherwise, it renders the page wrapped in a component that restricts access to allowed user types.
 *
 * @returns A React element representing the protected Value Based Payments page or an unauthorized response.
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
