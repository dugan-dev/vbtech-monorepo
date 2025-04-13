import "server-only";

import { unauthorized } from "next/navigation";
import { PaymentsClaims } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the Claims Payments page with access control.
 *
 * This asynchronous function concurrently checks for user authentication and enforces a
 * rate limiting policy based on the current pathname. If a valid user is authenticated,
 * it returns a restricted component that displays the Claims Payments page; otherwise,
 * it returns an unauthorized response.
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
