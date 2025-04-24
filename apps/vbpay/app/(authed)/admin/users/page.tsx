import { UserManagement } from "./component/user-management";

import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { AdminUsers } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo"];

/**
 * Displays the admin user management page, enforcing authentication, rate limiting, and user type restrictions.
 *
 * Only authenticated users with allowed user types can access the interface. If the user is not authenticated, an unauthorized response is returned. Shows a loading skeleton while user data is loading.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: AdminUsers({}) }),
  ]);

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
      adminOnly
    >
      <Suspense fallback={<DataTableSkeleton columnCount={7} />}>
        <UserManagement />
      </Suspense>
    </RestrictByUserAppAttrsServer>
  );
}
