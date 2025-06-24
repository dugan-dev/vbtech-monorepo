import { RateLimiterRes } from "rate-limiter-flexible";

import { pageApiLimiter } from "../../lib/rate-limiter-flexible";

type PageRateLimitConfig = {
  getHeaders: () => Promise<Headers>;
  redirect: (url: string) => never;
  getRateLimitRoute: () => string;
  authenticatedUser: () => Promise<{ userId: string } | null | undefined>;
  getClientIp: (headers: Headers) => string;
};

type props = {
  pathname?: string;
  config: PageRateLimitConfig;
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
 * @param props - Configuration object containing utility functions and optional pathname
 * @returns Undefined if access is permitted; otherwise, a redirect response to the rate limit page.
 */
export async function checkPageRateLimit({ pathname, config }: props) {
  const {
    getHeaders,
    redirect,
    getRateLimitRoute,
    authenticatedUser,
    getClientIp,
  } = config;

  let rlKey = "";
  const user = await authenticatedUser();
  const headersList = await getHeaders();

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
      getRateLimitRoute()
        .concat("?url=" + (pathname || "/"))
        .concat("&retryAfter=" + retryAfter),
    );
  }
}
