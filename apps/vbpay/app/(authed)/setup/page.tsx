import "server-only";

import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { RateLimit } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { getClientIP } from "@workspace/ui/utils/get-client-ip";
import { checkPageRateLimit } from "@workspace/ui/utils/rate-limit/check-page-rate-limit";

import { NotSetupView } from "./components/not-setup-view";
import { NotSetupViewSkeleton } from "./components/not-setup-view-skeleton";

/**
 * Server component for the setup page that enforces rate limits, checks authentication, and verifies license status.
 *
 * Redirects unauthenticated users to the sign-in page and users with a valid license to the home page. If the user is authenticated but no license is present, renders the setup view within a suspense boundary using a loading skeleton as fallback.
 */

// Adapter function to convert Headers to plain object for getClientIP
function getClientIpFromHeaders(headers: Headers) {
  const plainHeaders = Object.fromEntries(headers.entries());
  return getClientIP(plainHeaders) || "unknown";
}

export default async function Page() {
  await checkPageRateLimit({
    pathname: "/setup",
    config: {
      getHeaders: headers,
      redirect,
      getRateLimitRoute: () => RateLimit({}),
      authenticatedUser,
      getClientIp: getClientIpFromHeaders,
    },
  });

  const user = await authenticatedUser();

  if (!user) {
    return unauthorized();
  }

  return (
    <Suspense fallback={<NotSetupViewSkeleton />}>
      <NotSetupView />
    </Suspense>
  );
}
