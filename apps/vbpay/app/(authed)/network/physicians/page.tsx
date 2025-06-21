import { ManageNetworkPhysicians } from "./components/manage-network-physicians";

import "server-only";

import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { NetworkPhysicians, RateLimit } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";
import { getClientIP } from "@workspace/ui/utils/get-client-ip";
import { checkPageRateLimit } from "@workspace/ui/utils/rate-limit/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

// Adapter function to convert Headers to plain object for getClientIP
function getClientIpFromHeaders(headers: Headers) {
  const plainHeaders = Object.fromEntries(headers.entries());
  return getClientIP(plainHeaders) || "unknown";
}

/**
 * Displays the network physicians management page with enforced rate limiting and user access restrictions.
 *
 * Authenticates the user and restricts access to allowed user types before rendering the management interface. Shows a loading skeleton while the main content is loading.
 *
 * @param searchParams - Promise resolving to URL search parameters, including the payer ID under "pId".
 * @returns A React server component for managing network physicians, or an unauthorized response if authentication fails.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({
      pathname: NetworkPhysicians({}),
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

  const { pId } = await searchParams;

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <Suspense fallback={<DataTableSkeleton columnCount={9} />}>
        <ManageNetworkPhysicians
          payerIdUrlParam={pId as string}
          userId={user.userId}
        />
      </Suspense>
    </RestrictByUserAppAttrsServer>
  );
}
