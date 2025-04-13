import "server-only";

import { redirect } from "next/navigation";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { RateLimiterRes } from "rate-limiter-flexible";

import { pageApiLimiter } from "@/lib/rate-limiter-flexible";

import { RateLimitCard } from "./components/rate-limit-card";

/**
 * Processes a page request by authenticating the user and enforcing rate limiting.
 *
 * The function concurrently retrieves the authenticated user and query parameters. It then attempts to consume a rate limit token for the user (using the user's ID if available). If the rate limit has not been exceeded, it redirects the user to the provided URL (or to "/" if none is specified). If the rate limit is exceeded, it returns a component that displays the time remaining until a new request is allowed.
 *
 * @param searchParams - A promise that resolves to an object containing URL query parameters.
 * @returns A React component that displays the wait time if the request is rate limited.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [user, { url }] = await Promise.all([
    authenticatedUser(),
    searchParams,
  ]);

  let retryIn = 0;

  try {
    await pageApiLimiter.consume(user?.userId || "unknown");
  } catch (error) {
    const rlError = error as RateLimiterRes;
    retryIn = Math.ceil(rlError.msBeforeNext / 1000);
  }

  if (retryIn === 0) {
    const redirectUrl = url ? (url as string) : "/";
    redirect(redirectUrl);
  }

  return <RateLimitCard retryIn={retryIn} />;
}
