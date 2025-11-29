import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { Home } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";
import { StandardLayout } from "@/components/standard-layout";
import WorkList from "@/components/worklist/worklist";
import { WorklistSkeleton } from "@/components/worklist/worklist-skeleton";

type PageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * Render the authenticated home page while enforcing per-user rate limits.
 *
 * Applies page rate limiting, requires an authenticated user, and renders the standard layout that includes the work list. Returns an unauthorized response when no user is authenticated.
 *
 * @param searchParams - Optional promise resolving to request query parameters; these are forwarded to the WorkList component.
 * @returns The page element containing the layout and WorkList, or an unauthorized response when authentication is missing.
 */
export default async function Page({ searchParams }: PageProps) {
  const user = await authenticatedUser();
  await checkPageRateLimit({ pathname: Home({}), user });

  if (!user) {
    return unauthorized();
  }

  return (
    <StandardLayout>
      <RestrictByUserAppAttrsServer userId={user.userId}>
        <Suspense fallback={<WorklistSkeleton />}>
          <WorkList searchParams={searchParams} />
        </Suspense>
      </RestrictByUserAppAttrsServer>
    </StandardLayout>
  );
}