import { ManagePayers } from "./components/manage-payers";

import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { NetworkPayers } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the network payers management page for authenticated users.
 *
 * This asynchronous function concurrently checks user authentication and the page's
 * rate limit. If the user is not authenticated, it returns an unauthorized response.
 * Otherwise, it renders the page within a component that restricts access based on allowed
 * user attributes and displays the ManagePayers component.
 *
 * @returns A React element representing the page content or an unauthorized response.
 */
export default async function Page() {
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: NetworkPayers({}) }),
  ]);

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
