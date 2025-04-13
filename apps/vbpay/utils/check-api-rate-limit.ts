import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { RateLimiterRes } from "rate-limiter-flexible";

import { pageApiLimiter } from "@/lib/rate-limiter-flexible";

import { authenticatedUser } from "./amplify-server-utils";
import { getClientIp } from "./get-client-ip";

/**
 * Enforces API rate limiting for incoming requests.
 *
 * This asynchronous function identifies the requester by first checking for an authenticated user. If a user is authenticated, their unique identifier is used as the rate limiter key; otherwise, the client's IP address is extracted from the request headers. It then attempts to consume a token from the rate limiter.
 *
 * If a token is successfully consumed, the function returns undefined, allowing the request to proceed. If the rate limit is exceeded, it returns a JSON response with a 429 status code and a "Retry-After" header that indicates how many seconds the client should wait before retrying.
 *
 * @returns A JSON response with an error message and rate limit wait time if the limit is exceeded; returns undefined if the rate limit is not reached.
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
