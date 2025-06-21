import "server-only";

import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { ManagePaymentRates, RateLimit } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { getClientIP } from "@workspace/ui/utils/get-client-ip";
import { checkPageRateLimit } from "@workspace/ui/utils/rate-limit/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

// Adapter function to convert Headers to plain object for getClientIP
function getClientIpFromHeaders(headers: Headers) {
  const plainHeaders = Object.fromEntries(headers.entries());
  return getClientIP(plainHeaders) || "unknown";
}

/**
 * Renders the Manage Rate Sets page for authenticated users with allowed user types, enforcing rate limiting and access restrictions.
 *
 * @returns The page content if the user is authenticated and authorized; otherwise, an unauthorized response.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({
      pathname: ManagePaymentRates({}),
      config: {
        getHeaders: headers,
        redirect,
        getRateLimitRoute: () => RateLimit({}),
        authenticatedUser,
        getClientIp: getClientIpFromHeaders,
      },
    }),
  ]);

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
