import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { AdminSettings } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

import { LicenseCardSkeleton } from "./components/license/license-card-skeleton";
import { LicenseCardServer } from "./components/license/license-card.server";
import { SettingsCardSkeleton } from "./components/settings/settings-card-skeleton";
import { SettingsCardServer } from "./components/settings/settings-card.server";

/**
 * Renders the admin settings page, allowing access only to authenticated admin users and enforcing rate limiting.
 *
 * Returns an unauthorized response if the user is not authenticated. The page displays settings and license information, each loaded asynchronously with skeleton placeholders during loading.
 *
 * @returns The admin settings page for authenticated administrators, or an unauthorized response for unauthenticated users.
 */
export default async function Page() {
  // Check rate limiter
  const user = await authenticatedUser();
  await checkPageRateLimit({ pathname: AdminSettings({}), user });

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer userId={user.userId} adminOnly>
      <div className="flex flex-col gap-4">
        <Suspense fallback={<SettingsCardSkeleton />}>
          <SettingsCardServer />
        </Suspense>
        <Suspense fallback={<LicenseCardSkeleton />}>
          <LicenseCardServer />
        </Suspense>
      </div>
    </RestrictByUserAppAttrsServer>
  );
}
