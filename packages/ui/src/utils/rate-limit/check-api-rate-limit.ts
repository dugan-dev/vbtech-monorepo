import { RateLimiterRes } from "rate-limiter-flexible";

import { pageApiLimiter } from "../../lib/rate-limiter-flexible";

type props = {
  headers: Headers;
  authenticatedUser: () => Promise<{ userId: string } | null | undefined>;
  createResponse: (
    data: Record<string, unknown>,
    status: number,
    headers: Record<string, string>,
  ) => unknown;
  getClientIp: (headers: Headers) => string;
};

/**
 * Enforces API rate limiting for an incoming request.
 *
 * This function determines the rate limiting key by checking for an authenticated user. If a user is authenticated, their unique identifier is used; otherwise, the client's IP address is retrieved from the request headers. It then attempts to consume a rate limit token. If successful, the function returns undefined, allowing the request to proceed. If the rate limit is exceeded, it returns a response with a 429 status code and a "Retry-After" header indicating the number of seconds the client must wait before retrying.
 *
 * @param props - Object containing headers, authenticatedUser function, createResponse function, and getClientIp function
 * @returns A promise that resolves to undefined if the request is within limits, or a response with error details when the rate limit is exceeded.
 */
export async function checkApiRateLimit({
  headers,
  authenticatedUser,
  createResponse,
  getClientIp,
}: props) {
  let rlKey: string;
  const user = await authenticatedUser();

  if (user) {
    rlKey = user.userId;
  } else {
    const ip = getClientIp(headers);
    if (!ip) {
      throw new Error(
        "Could not determine client IP address for rate limiting.",
      );
    }
    rlKey = ip;
  }

  try {
    await pageApiLimiter.consume(rlKey);
    return undefined;
  } catch (error) {
    const rlError = error as RateLimiterRes;
    const retryAfter = Math.ceil(rlError.msBeforeNext / 1000);

    return createResponse(
      {
        error: `API rate limit exceeded. Please try again in ${retryAfter} seconds.`,
      },
      429,
      { "Retry-After": retryAfter.toString() },
    );
  }
}
