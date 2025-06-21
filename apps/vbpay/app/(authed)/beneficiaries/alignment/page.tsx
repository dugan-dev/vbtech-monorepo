import "server-only";

import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { RateLimit } from "@/routes";
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
 * Renders the Beneficiary Alignment page on the server with concurrent user authentication and rate limiting.
 *
 * This asynchronous component verifies the user's authentication and applies a rate limit check based on the current pathname.
 * If the user is not authenticated, it returns an unauthorized response; otherwise, it renders the Beneficiary Alignment page
 * with access restricted by allowed user types.
 *
 * @returns A JSX element representing the restricted Beneficiary Alignment page, or an unauthorized response when the user is not authenticated.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({
      pathname: "/beneficiaries/alignment",
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
      <div className="flex-1 flex flex-col space-y-4">
        <h1>Beneficiary Alignment</h1>
      </div>
    </RestrictByUserAppAttrsServer>
  );
}
