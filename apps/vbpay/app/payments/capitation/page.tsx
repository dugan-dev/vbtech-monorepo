import "server-only";

import { unauthorized } from "next/navigation";
import { PaymentsCapitation } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the Capitation Payments page for authenticated users.
 *
 * Concurrently checks user authentication and applies rate limiting by validating the page's pathname.
 * If an authenticated user is found, the page is rendered within a component that restricts access to specific user types.
 * Otherwise, an unauthorized response is returned.
 *
 * @returns A React element for authorized users, or an unauthorized response.
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
