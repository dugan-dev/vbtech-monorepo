import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { RateLimiterRes } from "rate-limiter-flexible";

import { pageApiLimiter } from "@/lib/rate-limiter-flexible";

import { authenticatedUser } from "./amplify-server-utils";
import { getClientIp } from "./get-client-ip";

/**
 * Enforces API rate limiting based on user authentication or client IP.
 *
 * This asynchronous function determines a unique key for rate limiting by checking if a user is authenticated—using the user's ID if available—or by retrieving the client's IP address from the request headers when not authenticated. It then attempts to consume a token from the rate limiter. If the token consumption fails due to exceeding the permitted limit, the function responds with a JSON error message, a 429 status code, and a "Retry-After" header indicating the wait time (in seconds) until the next allowed request.
 *
 * @returns A JSON response with error details and a 429 status code when the rate limit is exceeded; otherwise, undefined.
 */
export async function checkApiRateLimit() {
  let rlKey = "";
  const user = await authenticatedUser();

  if (user) {
    rlKey = user.userId;
  } else {
    const headersList = await headers();
    rlKey = getClientIp(headersList);
  }

  try {
    await pageApiLimiter.consume(rlKey);
    return undefined;
  } catch (error) {
    const rlError = error as RateLimiterRes;
    const retryAfter = Math.ceil(rlError.msBeforeNext / 1000);

    return NextResponse.json(
      {
        error: `API rate limit exceeded. Please try again in ${retryAfter} seconds.`,
      },
      { status: 429, headers: { "Retry-After": retryAfter.toString() } },
    );
  }
}
