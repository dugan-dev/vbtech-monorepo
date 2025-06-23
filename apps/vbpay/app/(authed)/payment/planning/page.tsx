import "server-only";

import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { PaymentPlanning, RateLimit } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { getClientIpFromHeaders } from "@workspace/ui/utils/get-client-ip";
import { checkPageRateLimit } from "@workspace/ui/utils/rate-limit/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

/**
 * Renders the payment planning page for authenticated users with permitted roles.
 *
 * Awaits user authentication, enforces rate limiting, and restricts access to users with allowed roles.
 *
 * @returns The payment planning page as a JSX element, or an unauthorized response if the user is not authenticated.
 */
export default async function Page() {
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({
      pathname: PaymentPlanning({}),
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
        <h1>Payment Planning</h1>
      </div>
    </RestrictByUserAppAttrsServer>
  );
}
