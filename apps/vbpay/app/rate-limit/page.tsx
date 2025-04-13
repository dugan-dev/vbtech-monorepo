import "server-only";

import { redirect } from "next/navigation";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { RateLimiterRes } from "rate-limiter-flexible";

import { pageApiLimiter } from "@/lib/rate-limiter-flexible";

import { RateLimitCard } from "./components/rate-limit-card";

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
