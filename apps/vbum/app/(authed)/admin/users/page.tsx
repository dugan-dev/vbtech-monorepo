import { UserManagement } from "./component/user-management";

import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { AdminUsers } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";
import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";

import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

/**
 * Renders the admin user management page with authentication, rate limiting, and user type restrictions.
 *
 * Only authenticated users with permitted user types can access this page. If the user is not authenticated, an unauthorized response is returned. A loading skeleton is displayed while user management data is loading.
 */
export default async function Page() {
  // Get user first, then check rate limiter with user context
  const user = await authenticatedUser();
  await checkPageRateLimit({ pathname: AdminUsers({}), user });

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer userId={user.userId} adminOnly>
      <Suspense fallback={<DataTableSkeleton columnCount={7} />}>
        <UserManagement />
      </Suspense>
    </RestrictByUserAppAttrsServer>
  );
}
