import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { Home } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";
import { StandardLayout } from "@/components/standard-layout";
import WorkList from "@/components/worklist/worklist";
import { WorklistSkeleton } from "@/components/worklist/worklist-skeleton";

/**
 * Serves the home page for authenticated users within rate limits.
 *
 * Enforces rate limiting and user authentication before rendering the home page. Returns an unauthorized response if the user is not authenticated.
 */
export default async function Page() {
  const user = await authenticatedUser();
  await checkPageRateLimit({ pathname: Home({}), user });

  if (!user) {
    return unauthorized();
  }

  return (
    <StandardLayout>
      <RestrictByUserAppAttrsServer userId={user.userId}>
        <Suspense fallback={<WorklistSkeleton />}>
          <WorkList />
        </Suspense>
      </RestrictByUserAppAttrsServer>
    </StandardLayout>
  );
}
