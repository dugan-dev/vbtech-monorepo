import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { AdminSettings } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

import { LicenseCardSkeleton } from "./components/license/license-card-skeleton";
import { LicenseCardServer } from "./components/license/license-card.server";
import { SettingsCardSkeleton } from "./components/settings/settings-card-skeleton";
import { SettingsCardServer } from "./components/settings/settings-card.server";

/**
 * Asynchronously renders the admin settings page with restricted access.
 *
 * This function concurrently verifies user authentication and performs a rate limit check. If the user is not authenticated,
 * it returns an unauthorized response. Otherwise, it wraps the page content in a component that restricts access to admin users,
 * and displays the settings and license sections using Suspense components to show loading fallbacks.
 *
 * @returns A JSX element representing the page content for an authenticated admin user, or an unauthorized response.
 */
export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: AdminSettings({}) }),
  ]);

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
