import { ManageNetworkEntities } from "./components/manage-network-entities";

import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { NetworkEntities } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";
import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Displays the network entity management page with authentication, rate limiting, and user-type restrictions.
 *
 * Retrieves URL search parameters and the authenticated user concurrently, enforces rate limiting, and restricts access to allowed user types. If the user is not authenticated, returns an unauthorized response; otherwise, renders the management interface with a loading fallback.
 *
 * @param searchParams - Promise resolving to the URL search parameters.
 * @returns The restricted network management page as a JSX element, or an unauthorized response if access is denied.
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

  // check page rate limit
  await checkPageRateLimit({ pathname: NetworkEntities({}) });

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <Suspense fallback={<DataTableSkeleton columnCount={7} />}>
        <ManageNetworkEntities
          payerIdUrlParam={pId as string}
          userId={user.userId}
        />
      </Suspense>
    </RestrictByUserAppAttrsServer>
  );
}
