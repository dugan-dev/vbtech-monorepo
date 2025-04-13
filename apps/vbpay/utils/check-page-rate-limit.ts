import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RateLimit } from "@/routes";
import { RateLimiterRes } from "rate-limiter-flexible";

import { pageApiLimiter } from "@/lib/rate-limiter-flexible";

import { authenticatedUser } from "./amplify-server-utils";
import { getClientIp } from "./get-client-ip";

type props = {
  pathname: string;
};

/**
 * Enforces rate limiting on page access based on user authentication.
 *
 * This function determines the appropriate rate limit key from either the authenticated user's ID or the client's IP address.
 * It then attempts to consume a rate limit token associated with that key.
 *
 * If a token is available, the function returns undefined, allowing access. If the rate limit is exceeded, it computes the
 * retry delay (in seconds) from the error and returns a redirect response to a rate limit notification page with the original
 * pathname and retry delay appended as query parameters.
 *
 * @param pathname The URL path being accessed, used for inclusion in a redirect URL if the rate limit is exceeded.
 * @returns Undefined if access is permitted; otherwise, a redirect response to the rate limit page.
 */
export async function checkPageRateLimit({ pathname }: props) {
  let rlKey = "";
  const user = await authenticatedUser();

  const headersList = await headers();

  if (user) {
    rlKey = user.userId;
  } else {
    rlKey = getClientIp(headersList);
  }

  try {
    await pageApiLimiter.consume(rlKey);
    return undefined;
  } catch (error) {
    const rlError = error as RateLimiterRes;
    const retryAfter = Math.ceil(rlError.msBeforeNext / 1000);
    return redirect(
      RateLimit({})
        .concat("?url=" + pathname)
        .concat("&retryAfter=" + retryAfter),
    );
  }
}
