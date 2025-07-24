import { headers } from "next/headers";
import { RateLimiterAbstract } from "rate-limiter-flexible";

import { getClientIp } from "./get-client-ip";

type RateLimitingDependencies = {
  rateLimiter: RateLimiterAbstract;
  rateLimitRoute: (params: { secs: number }) => string;
};

type RateLimiterRejection = {
  msBeforeNext: number;
};

export function createCheckPageRateLimit(deps: RateLimitingDependencies) {
  return async function checkPageRateLimit({ pathname }: { pathname: string }) {
    let rlKey = "";
    try {
      const headerList = await headers();
      const ip = getClientIp(headerList);
      rlKey = `${ip}:${pathname}`;
      await deps.rateLimiter.consume(rlKey);
    } catch (rejRes: unknown) {
      const rejection = rejRes as RateLimiterRejection;
      const secs = Math.round(rejection.msBeforeNext / 1000) || 1;
      const rateLimitRoute = deps.rateLimitRoute({ secs });
      throw new Error(`Rate limit exceeded. Redirecting to: ${rateLimitRoute}`);
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
      rlKey = `${ip}:api`;
      await deps.rateLimiter.consume(rlKey);
    } catch (rejRes: unknown) {
      const rejection = rejRes as RateLimiterRejection;
      const secs = Math.round(rejection.msBeforeNext / 1000) || 1;
      throw new Error(`Rate limit exceeded. Try again in ${secs} seconds.`);
    }
  };
}
