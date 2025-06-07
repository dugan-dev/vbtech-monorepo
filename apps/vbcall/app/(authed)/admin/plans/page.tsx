import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { AdminHealthPlans } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";

import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

import { ManageHealthPlans } from "./components/manage-health-plans";

/**
 * Renders the admin health plans management page with authentication, authorization, and rate limiting.
 *
 * Authenticates the user and enforces rate limits before rendering the management interface. Only admin users with appropriate attributes can access the page. Displays a skeleton loader while the health plans management component loads.
 *
 * @param searchParams - A promise resolving to the URL query parameters.
 * @returns The health plans management interface for authorized admin users, or an unauthorized response if authentication fails.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [{ cId }, user] = await Promise.all([
    searchParams,
    authenticatedUser(),
    checkPageRateLimit({ pathname: AdminHealthPlans({}) }),
  ]);

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer userId={user.userId} adminOnly>
      <Suspense fallback={<DataTableSkeleton columnCount={6} />}>
        <ManageHealthPlans
          userId={user.userId}
          clientPubIdUrlParam={typeof cId === "string" ? cId : undefined}
        />
      </Suspense>
    </RestrictByUserAppAttrsServer>
  );
}
