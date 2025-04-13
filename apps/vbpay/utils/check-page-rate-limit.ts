import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RateLimit } from "@/routes";
import { RateLimiterRes } from "rate-limiter-flexible";

import { pageApiLimiter } from "@/lib/rate-limiter-flexible";

import { authenticatedUser } from "./amplify-server-utils";

type props = {
  pathname: string;
};

export async function checkPageRateLimit({ pathname }: props) {
  let rlKey = "";
  const user = await authenticatedUser();

  const headersList = await headers();

  if (user) {
    rlKey = user.userId;
  } else {
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
    return redirect(
      RateLimit({})
        .concat("?url=" + pathname)
        .concat("&retryAfter=" + retryAfter),
    );
  }
}
