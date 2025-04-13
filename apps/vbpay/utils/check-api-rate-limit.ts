import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { RateLimiterRes } from "rate-limiter-flexible";

import { pageApiLimiter } from "@/lib/rate-limiter-flexible";

import { authenticatedUser } from "./amplify-server-utils";

export async function checkApiRateLimit() {
  let rlKey = "";
  const user = await authenticatedUser();

  if (user) {
    rlKey = user.userId;
  } else {
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown";
    rlKey = ip;
  }

  try {
    await pageApiLimiter.consume(rlKey);
    return undefined;
  } catch (error) {
    const rlError = error as RateLimiterRes;
    const retryAfter = Math.ceil(rlError.msBeforeNext / 1000);

    return NextResponse.json(
      {
        error: `API rate limit exceeded. Please try again in ${retryAfter} seconds.`,
      },
      { status: 429, headers: { "Retry-After": retryAfter.toString() } },
    );
  }
}
