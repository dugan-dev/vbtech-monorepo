import "server-only";

import { AuthUser } from "aws-amplify/auth";
import { RateLimiterAbstract, RateLimiterRes } from "rate-limiter-flexible";

type RateLimitPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  authenticatedUser: () => Promise<AuthUser | undefined>;
  pageApiLimiter: RateLimiterAbstract;
  redirect: (url: string) => void;
};

export default async function getRateLimitStatus({
  searchParams,
  authenticatedUser,
  pageApiLimiter,
  redirect,
}: RateLimitPageProps): Promise<number> {
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

  return retryIn;
}
