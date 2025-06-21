import { UserManagement } from "./component/user-management";

import "server-only";

import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { RateLimit } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";
import { getClientIP } from "@workspace/ui/utils/get-client-ip";
import { checkPageRateLimit } from "@workspace/ui/utils/rate-limit/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo"];

// Adapter function to convert Headers to plain object for getClientIP
function getClientIpFromHeaders(headers: Headers) {
  const plainHeaders = Object.fromEntries(headers.entries());
  return getClientIP(plainHeaders) || "unknown";
}

/**
 * Renders the admin user management page with authentication, rate limiting, and user type restrictions.
 *
 * Only authenticated users with permitted user types can access this page. If the user is not authenticated, an unauthorized response is returned. A loading skeleton is displayed while user management data is loading.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({
      pathname: "/admin/users",
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
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
      adminOnly
    >
      <Suspense fallback={<DataTableSkeleton columnCount={7} />}>
        <UserManagement />
      </Suspense>
    </RestrictByUserAppAttrsServer>
  );
}
