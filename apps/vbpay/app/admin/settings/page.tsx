import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

import { LicenseCardSkeleton } from "./components/license/license-card-skeleton";
import { LicenseCardServer } from "./components/license/license-card.server";
import { SettingsCardSkeleton } from "./components/settings/settings-card-skeleton";
import { SettingsCardServer } from "./components/settings/settings-card.server";

/**
 * Renders the admin settings page for an authenticated user.
 *
 * This asynchronous function retrieves the current user. If no user is authenticated, it handles unauthorized access.
 * For authenticated users, the page content is wrapped in a component that restricts access based on user attributes,
 * ensuring that only admin users can access the settings. The main content includes two server components for settings
 * and license information, each rendered within a Suspense component that displays a loading skeleton until the data is loaded.
 *
 * @returns The page content as a React node.
 */
export default async function Page() {
  const user = await authenticatedUser();

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer userId={user.userId} adminOnly>
      <div className="flex flex-col gap-4">
        <Suspense fallback={<SettingsCardSkeleton />}>
          <SettingsCardServer userId={user.userId} />
        </Suspense>
        <Suspense fallback={<LicenseCardSkeleton />}>
          <LicenseCardServer userId={user.userId} />
        </Suspense>
      </div>
    </RestrictByUserAppAttrsServer>
  );
}
