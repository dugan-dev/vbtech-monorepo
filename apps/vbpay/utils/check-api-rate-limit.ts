import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { RateLimiterRes } from "rate-limiter-flexible";

import { pageApiLimiter } from "@/lib/rate-limiter-flexible";

import { authenticatedUser } from "./amplify-server-utils";
import { getClientIp } from "./get-client-ip";

/**
 * Enforces API rate limiting for an incoming request.
 *
 * This function determines the rate limiting key by checking for an authenticated user. If a user is authenticated, their unique identifier is used; otherwise, the client's IP address is retrieved from the request headers. It then attempts to consume a rate limit token. If successful, the function returns undefined, allowing the request to proceed. If the rate limit is exceeded, it returns a JSON response with a 429 status code and a "Retry-After" header indicating the number of seconds the client must wait before retrying.
 *
 * @returns A promise that resolves to undefined if the request is within limits, or a JSON response with error details when the rate limit is exceeded.
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
