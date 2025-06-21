import "server-only";

import { redirect } from "next/navigation";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import getRateLimitStatus from "@workspace/ui/components/common/rate-limit-page";
import { pageApiLimiter } from "@workspace/ui/lib/rate-limiter-flexible";

import { RateLimitCardClient } from "./components/rate-limit-card-client";

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
  const retryIn = await getRateLimitStatus({
    searchParams,
    authenticatedUser,
    pageApiLimiter,
    redirect,
  });

  return <RateLimitCardClient retryIn={retryIn} />;
}
