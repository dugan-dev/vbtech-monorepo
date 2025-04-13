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
 * Concurrently checks for user authentication and applies a rate limit check. If the user is not authenticated,
 * the function returns an unauthorized response. Otherwise, it renders the page content wrapped in a component that
 * restricts access based on allowed user attributes.
 *
 * @returns The Capitation Payments page component or an unauthorized response.
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
