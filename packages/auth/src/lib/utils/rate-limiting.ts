import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RateLimiterAbstract } from "rate-limiter-flexible";

import { getClientIp } from "./get-client-ip";

type RateLimitingDependencies = {
  rateLimiter: RateLimiterAbstract;
  rateLimitRoute: (params: { secs: number }) => string;
};

type User = {
  userId: string;
};

type RateLimiterRejection = {
  msBeforeNext: number;
};

function isRateLimiterRejection(error: unknown): error is RateLimiterRejection {
  return (
    typeof error === "object" &&
    error !== null &&
    "msBeforeNext" in error &&
    typeof (error as RateLimiterRejection).msBeforeNext === "number"
  );
}

export function createCheckPageRateLimit(deps: RateLimitingDependencies) {
  return async function checkPageRateLimit({
    pathname,
    user,
  }: {
    pathname: string;
    user?: User;
  }) {
    // Skip rate limiting for the rate limit page itself to prevent redirect loops
    if (pathname.includes("/rate-limit")) {
      return;
    }

    let rlKey = "";
    try {
      const headerList = await headers();
      const ip = getClientIp(headerList);

      // Use user-based rate limiting for authenticated users, IP-based for public pages
      if (user?.userId) {
        rlKey = `user:${user.userId}:global`;
      } else {
        rlKey = `${ip}:global`;
      }

      await deps.rateLimiter.consume(rlKey);
    } catch (rejRes: unknown) {
      if (isRateLimiterRejection(rejRes)) {
        const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
        const rateLimitRoute = deps.rateLimitRoute({ secs });
        redirect(rateLimitRoute);
      } else {
        // Re-throw unexpected errors
        throw rejRes;
      }
    }
  };
}

export function createCheckApiRateLimit(
  deps: Pick<RateLimitingDependencies, "rateLimiter">,
) {
  return async function checkApiRateLimit() {
    let rlKey = "";
    try {
      const headerList = await headers();
      const ip = getClientIp(headerList);
      // Use the same global rate limiting key as pages for consistency
      rlKey = `${ip}:global`;
      await deps.rateLimiter.consume(rlKey);
    } catch (rejRes: unknown) {
      if (isRateLimiterRejection(rejRes)) {
        const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
        throw new Error(`Rate limit exceeded. Try again in ${secs} seconds.`);
      } else {
        // Re-throw unexpected errors
        throw rejRes;
      }
    }
  };
}
