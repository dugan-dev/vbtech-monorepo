import { ManageNetworkPhysicians } from "./components/manage-network-physicians";

import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { NetworkPhysicians } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";
import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

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
  const [{ pId }, user] = await Promise.all([
    searchParams,
    authenticatedUser(),
  ]);

  // check page rate limit with user context
  await checkPageRateLimit({ pathname: NetworkPhysicians({}), user });

  if (!user) {
    return unauthorized();
  }

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
