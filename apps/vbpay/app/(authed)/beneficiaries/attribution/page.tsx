import "server-only";

import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { BeneficiariesAttribution, RateLimit } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { getClientIP } from "@workspace/ui/utils/get-client-ip";
import { checkPageRateLimit } from "@workspace/ui/utils/rate-limit/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

// Adapter function to convert Headers to plain object for getClientIP
function getClientIpFromHeaders(headers: Headers) {
  const plainHeaders = Object.fromEntries(headers.entries());
  return getClientIP(plainHeaders) || "unknown";
}

/**
 * Renders the beneficiaries attribution page for authenticated users with permitted roles.
 *
 * Awaits user authentication, enforces rate limiting, and restricts access to users with allowed roles.
 *
 * @returns The beneficiaries attribution page as a JSX element, or an unauthorized response if the user is not authenticated.
 */
export default async function Page() {
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({
      pathname: BeneficiariesAttribution({}),
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
      allowedUserTypes={["bpo", "payers", "payer"] as UserType[]}
      userId={user.userId}
    >
      <div className="flex-1 flex flex-col space-y-4">
        <h1>Beneficiaries Attribution</h1>
      </div>
    </RestrictByUserAppAttrsServer>
  );
}
