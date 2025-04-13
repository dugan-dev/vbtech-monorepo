import "server-only";

import { unauthorized } from "next/navigation";
import { PaymentsPerformance } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the payments performance page by concurrently verifying user authentication and rate limits.
 *
 * This function checks for an authenticated user and applies a rate limiting constraint simultaneously.
 * If no authenticated user is found, it returns an unauthenticated response.
 * Otherwise, it renders the payments performance content within a component that restricts access to allowed user types,
 * displaying the "Value Based Payments" heading.
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
