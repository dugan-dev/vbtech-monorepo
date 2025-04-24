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
 * Displays the admin settings page, enforcing authentication, admin access, and rate limiting.
 *
 * If the user is not authenticated, returns an unauthorized response. Only admin users can access the page content, which includes settings and license information loaded asynchronously with skeleton fallbacks.
 *
 * @returns The admin settings page for authenticated administrators, or an unauthorized response for unauthenticated users.
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
          <SettingsCardServer />
        </Suspense>
        <Suspense fallback={<LicenseCardSkeleton />}>
          <LicenseCardServer />
        </Suspense>
      </div>
    </RestrictByUserAppAttrsServer>
  );
}
