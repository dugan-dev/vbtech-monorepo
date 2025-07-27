import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { RateLimitCard } from "@workspace/auth/components/rate-limit-card";
import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";
import { getClientIp } from "@workspace/auth/lib/utils/get-client-ip";
import {
  PAGE_RATE_LIMIT,
  pageApiLimiter,
  RateLimiterRes,
} from "@workspace/auth/lib/utils/rate-limiter-flexible";

/**
 * Authenticates the user, applies rate limiting, and either redirects or displays a wait time.
 *
 * This asynchronous component concurrently retrieves the authenticated user and search parameters.
 * It attempts to consume a rate limit token based on the user's ID. If the user exceeds the rate
 * limit, it calculates the required wait time and renders a RateLimitCard component with this value.
 * Otherwise, it redirects the user to the specified URL (or to the root path if no URL is provided).
 *
 * @param searchParams - A promise that resolves to an object mapping query parameter keys to their values.
 *
 * @returns A React element displaying the rate limit wait time if the request is rate limited.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [user, { url }, headerList] = await Promise.all([
    authenticatedUser(),
    searchParams,
    headers(),
  ]);

  let retryIn = 0;

  try {
    // Use the same rate limiting key as the page rate limiter
    // User-based for authenticated users, IP-based for public pages
    let rlKey: string;
    if (user?.userId) {
      rlKey = `user:${user.userId}:global`;
    } else {
      const ip = getClientIp(headerList);
      rlKey = `${ip}:global`;
    }
    await pageApiLimiter().consume(rlKey);
  } catch (error) {
    const rlError = error as RateLimiterRes;
    retryIn = Math.ceil(rlError.msBeforeNext / 1000);
  }

  if (retryIn === 0) {
    const redirectUrl = url ? (url as string) : "/";
    redirect(redirectUrl);
  }

  return (
    <RateLimitCard
      retryIn={retryIn}
      maxDuration={PAGE_RATE_LIMIT.BLOCK_DURATION}
    />
  );
}
