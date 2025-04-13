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
 * Enforces rate limiting on a page request.
 *
 * The function determines the rate limit key by checking for an authenticated user—using the user's ID if present—or falling back to the client's IP address extracted from the request headers. It then attempts to consume a rate limit token. If successful, the request proceeds (returning undefined). If the rate limit is exceeded, it calculates the wait time (in seconds) before a new token is available and redirects the client to a rate limit page with the original pathname and retry delay appended as query parameters.
 *
 * @param pathname The URL path of the page being accessed.
 * @returns Undefined if within rate limits; otherwise, a redirect response indicating the required wait time.
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
