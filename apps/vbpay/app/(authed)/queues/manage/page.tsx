import "server-only";

import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { RateLimit } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { getClientIP } from "@workspace/ui/utils/get-client-ip";
import { checkPageRateLimit } from "@workspace/ui/utils/rate-limit/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo"];

function getClientIpFromHeaders(headers: Headers) {
  const plainHeaders = Object.fromEntries(headers.entries());
  return getClientIP(plainHeaders) || "unknown";
}

/**
 * Renders the Manage Queues page for authenticated and authorized users.
 *
 * This asynchronous function concurrently verifies user authentication and applies a rate limit check. If the authenticated user
 * is not found, it returns an unauthorized response. Otherwise, it renders a restricted component that only permits access for
 * allowed user types and displays the "Manage Queues" header.
 *
 * @returns A React element representing the Manage Queues page or an unauthorized response if access is denied.
 */
export default async function Page() {
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({
      pathname: "/queues/manage",
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
      adminOnly
    >
      <h1>Manage Queues</h1>
    </RestrictByUserAppAttrsServer>
  );
}
