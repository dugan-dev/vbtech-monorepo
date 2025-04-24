import "server-only";

import { unauthorized } from "next/navigation";
import { PaymentsClaims } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the server-side Claims Payments page with enforced rate limiting and user access restrictions.
 *
 * This asynchronous function concurrently checks if the current user is authenticated while validating
 * the page's rate limit. If no authenticated user is found, it returns an unauthorized response. Otherwise,
 * it renders a component that restricts access based on allowed user types and displays the "Claims Payments" header.
 *
 * @returns A restricted page component when authentication and rate limiting checks succeed, or an unauthorized response if the user is not authenticated.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: PaymentsClaims({}) }),
  ]);

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <h1>Claims Payments</h1>
    </RestrictByUserAppAttrsServer>
  );
}
