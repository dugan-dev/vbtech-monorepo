import "server-only";

import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { FileUpload, RateLimit } from "@/routes";
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
 * Renders the File Upload page with concurrent rate limiting and authentication checks.
 *
 * This asynchronous component concurrently checks the rate limit for the file upload pathname and retrieves
 * the authenticated user. If no authenticated user is found, it returns an unauthorized response. Otherwise,
 * it renders the File Upload interface within a restricted access wrapper that enforces allowed user types.
 *
 * @returns The rendered File Upload page for authenticated and authorized users, or an unauthorized response.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({
      pathname: FileUpload({}),
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
      <h1>File Upload</h1>
    </RestrictByUserAppAttrsServer>
  );
}
