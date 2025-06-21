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
 * Renders the Beneficiary page for authenticated users with rate limits enforced.
 *
 * This server component awaits a promise resolving to a parameters object containing the page slug, then concurrently
 * performs user authentication and a rate limit check based on the generated pathname. If the user is not authenticated,
 * it returns an unauthorized response. Otherwise, it renders the Beneficiary page wrapped in a component that restricts
 * access according to allowed user types.
 *
 * @param params A promise that resolves to an object with a slug property used to generate the page pathname.
 * @returns A React element representing the Beneficiary page or an unauthorized response.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({
      pathname: `/beneficiary/${slug}`,
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
        <h1>Beneficiary: {slug}</h1>
      </div>
    </RestrictByUserAppAttrsServer>
  );
}
