import "server-only";

import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { RateLimit } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";
import { getClientIP } from "@workspace/ui/utils/get-client-ip";
import { checkPageRateLimit } from "@workspace/ui/utils/rate-limit/check-page-rate-limit";

import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

import { ManageClients } from "./components/manage-clients";

// Adapter function to convert Headers to plain object for getClientIP
function getClientIpFromHeaders(headers: Headers) {
  const plainHeaders = Object.fromEntries(headers.entries());
  return getClientIP(plainHeaders) || "unknown";
}

export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({
      pathname: "/admin/clients",
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
        <ManageClients />
      </Suspense>
    </RestrictByUserAppAttrsServer>
  );
}
