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
