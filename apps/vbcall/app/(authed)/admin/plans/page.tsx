import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { AdminHealthPlans } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";

import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

import { ManageHealthPlans } from "./components/manage-health-plans";

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
