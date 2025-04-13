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
 * Enforces the rate limit for a page access request.
 *
 * This function determines the rate limit key by using the authenticated user's ID if available or the client's IP address otherwise.
 * It attempts to consume a rate limit token using the determined key. If token consumption succeeds, it returns undefined,
 * allowing the request to proceed. If the rate limit is exceeded, it calculates the retry delay and returns a redirect response
 * to a rate limit page, including the original pathname and the delay (in seconds) in the query parameters.
 *
 * @param param - Object containing request-related parameters.
 * @param param.pathname - The original page URL used for generating the redirection URL if the rate limit is exceeded.
 * @returns A promise that resolves to undefined when within rate limits or to a redirect response when the rate limit has been exceeded.
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
