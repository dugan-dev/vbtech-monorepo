import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { AdminPhysicians } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";
import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";

import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

import { ManagePhysicians } from "./components/manage-physicians";

export default async function Page() {
  // Get user first, then check rate limiter with user context
  const user = await authenticatedUser();
  await checkPageRateLimit({ pathname: AdminPhysicians({}), user });

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer userId={user.userId} adminOnly>
      <Suspense fallback={<DataTableSkeleton columnCount={6} />}>
        <ManagePhysicians />
      </Suspense>
    </RestrictByUserAppAttrsServer>
  );
}
