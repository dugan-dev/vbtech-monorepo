import { ManageNetworkPhysicians } from "./components/manage-network-physicians";

import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { NetworkPhysicians } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the network physicians management page with built-in rate limiting and access control.
 *
 * The function enforces rate limits by verifying the page's access frequency before concurrently fetching the
 * URL search parameters and authenticating the user. If authentication fails, an unauthorized response is returned.
 * Otherwise, it wraps the network physicians management component in a user restriction layer based on allowed user types.
 *
 * @param searchParams - A promise resolving to an object of URL search parameters, including a payer ID under the key "pId".
 * @returns A promise that resolves to a React server component for managing network physicians.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // check page rate limit
  await checkPageRateLimit({ pathname: NetworkPhysicians({}) });

  const [{ pId }, user] = await Promise.all([
    searchParams,
    authenticatedUser(),
  ]);

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
