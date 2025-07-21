import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { NetworkPhysician } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

import { UserType } from "@/types/user-type";
import { PhysEntityPaymentMethodCardSkeleton } from "@/components/phys-entity-payment-method-card/phys-entity-payment-method-card-skeleton";
import { PhysEntityPaymentMethodCardServer } from "@/components/phys-entity-payment-method-card/phys-entity-payment-method-card.server";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

import { PhysAffiliatesCardServer } from "./components/affiliates/phys-affiliates-card.server";
import { PhysAffiliatesCardSkeleton } from "./components/affiliates/phys-affiliates-skeleton";
import { PhysicianInfoCardSkeleton } from "./components/info/physician-info-card-skeleton";
import { PhysicianInfoCardServer } from "./components/info/physician-info-card.server";
import { PhysPyConfigCardSkeleton } from "./components/py-config/phys-py-config-card-skeleton";
import { PhysPyConfigCardServer } from "./components/py-config/phys-py-config-card.server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer", "physician"];

/**
 * Renders the physician network page as a server component with authentication and access control.
 *
 * Displays physician details, affiliates, performance year configuration, and payment method information for a specified physician. Access is limited to authenticated users with permitted user types; unauthenticated users receive an unauthorized response.
 *
 * @param searchParams - Promise resolving to query parameters, which may include a performance year.
 * @param params - Promise resolving to route parameters containing the physician's public slug.
 *
 * @returns The server-rendered React component for the physician network page, or an unauthorized response if the user is not authenticated.
 */
export default async function Page({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [{ perfYear }, user] = await Promise.all([
    searchParams,
    authenticatedUser(),
    checkPageRateLimit({ pathname: NetworkPhysician({ slug }) }),
  ]);

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Suspense fallback={<PhysicianInfoCardSkeleton />}>
            <PhysicianInfoCardServer pubId={slug as string} />
          </Suspense>

          <Suspense fallback={<PhysAffiliatesCardSkeleton />}>
            <PhysAffiliatesCardServer pubId={slug as string} />
          </Suspense>
        </div>
        <div className="flex flex-col gap-4">
          <Suspense
            fallback={
              <PhysPyConfigCardSkeleton perfYear={perfYear as string} />
            }
          >
            <PhysPyConfigCardServer
              physPubId={slug as string}
              perfYearUrl={perfYear ? (perfYear as string) : undefined}
            />
          </Suspense>
          <Suspense fallback={<PhysEntityPaymentMethodCardSkeleton />}>
            <PhysEntityPaymentMethodCardServer physPubId={slug as string} />
          </Suspense>
        </div>
      </div>
    </RestrictByUserAppAttrsServer>
  );
}
