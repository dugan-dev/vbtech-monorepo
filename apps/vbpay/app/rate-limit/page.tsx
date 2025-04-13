import "server-only";

import { redirect } from "next/navigation";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { RateLimiterRes } from "rate-limiter-flexible";

import { pageApiLimiter } from "@/lib/rate-limiter-flexible";

import { RateLimitCard } from "./components/rate-limit-card";

/**
 * Handles a web page request by authenticating the user, enforcing rate limiting,
 * and either redirecting the request or rendering a rate limit notification.
 *
 * This asynchronous function concurrently retrieves the authenticated user and query parameters.
 * It attempts to consume a rate limit token for the user (defaulting to "unknown" for unauthenticated requests).
 * If the rate limit is exceeded, it calculates the retry delay (in seconds) based on the rate limiter's error
 * and returns a component that displays this wait time. Otherwise, if within the rate limit, it redirects the user
 * to the URL specified in the query parameters or to the root path if no URL is provided.
 *
 * @param searchParams - A promise that resolves to an object containing query parameters, including an optional
 *                       `url` property for redirection.
 *
 * @returns A React component displaying the remaining wait time if rate limited; otherwise, the function redirects.
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
