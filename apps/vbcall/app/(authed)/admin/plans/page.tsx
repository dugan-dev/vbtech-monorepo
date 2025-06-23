import "server-only";

import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { RateLimit } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";
import { getClientIpFromHeaders } from "@workspace/ui/utils/get-client-ip";
import { checkPageRateLimit } from "@workspace/ui/utils/rate-limit/check-page-rate-limit";

import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

import { ManageHealthPlans } from "./components/manage-health-plans";

/**
 * Serves the plans management page for authenticated users within rate limits.
 *
 * Enforces rate limiting and user authentication before rendering the plans management page. Returns an unauthorized response if the user is not authenticated. Only authenticated users with permitted user types can access this page. A loading skeleton is displayed while plans management data is loading.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({
      pathname: "/admin/plans",
      config: {
        getHeaders: headers,
        redirect,
        getRateLimitRoute: () => RateLimit({}),
        authenticatedUser,
        getClientIp: getClientIpFromHeaders,
      },
    }),
  ]);

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer userId={user.userId} adminOnly>
      <Suspense fallback={<DataTableSkeleton columnCount={6} />}>
        <ManageHealthPlans userId={user.userId} />
      </Suspense>
    </RestrictByUserAppAttrsServer>
  );
}
