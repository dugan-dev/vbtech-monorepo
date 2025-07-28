import { ManagePayers } from "./components/manage-payers";

import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { NetworkPayers } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";
import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Displays the network payers management page for authenticated users with appropriate access rights.
 *
 * Only users with allowed user types can access the page. If the user is not authenticated, an unauthorized response is returned. The main content is loaded asynchronously with a loading skeleton shown during data fetching.
 *
 * @returns The page content as a React element, or an unauthorized response if access is denied.
 */
export default async function Page() {
  const user = await authenticatedUser();
  await checkPageRateLimit({ pathname: NetworkPayers({}), user });

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <Suspense fallback={<DataTableSkeleton columnCount={8} />}>
        <ManagePayers userId={user.userId} />
      </Suspense>
    </RestrictByUserAppAttrsServer>
  );
}
