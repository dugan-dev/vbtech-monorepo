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
 * Renders the Manage Batches page, allowing access only to authenticated users with permitted user types.
 *
 * Applies rate limiting and restricts page content to users whose type is included in {@link ALLOWED_USER_TYPES}. Unauthorized users receive an immediate unauthorized response.
 *
 * @returns The restricted Manage Batches page for eligible users, or an unauthorized response if access is denied.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({
      pathname: "/payment/batches",
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
      <h1>Manage Batches</h1>
    </RestrictByUserAppAttrsServer>
  );
}
