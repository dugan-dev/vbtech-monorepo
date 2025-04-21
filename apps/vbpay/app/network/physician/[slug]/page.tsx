import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { NetworkPhysician } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

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
 * Renders the physician dashboard page, enforcing authentication, authorization, and rate limiting, and displaying physician-related data cards with loading states.
 *
 * @param searchParams - Promise resolving to query parameters, including an optional performance year.
 * @param params - Promise resolving to route parameters, including the physician's public identifier.
 *
 * @returns The physician dashboard UI if the user is authenticated and authorized; otherwise, triggers an unauthorized response.
 *
 * @remark Only users with allowed user types can access this page. The UI displays physician information, affiliates, performance year configuration (optionally filtered by the `perfYear` query parameter), and payment method details, each with loading placeholders.
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
            <PhysicianInfoCardServer
              userId={user.userId}
              pubId={slug as string}
            />
          </Suspense>

          <Suspense fallback={<PhysAffiliatesCardSkeleton />}>
            <PhysAffiliatesCardServer
              userId={user.userId}
              pubId={slug as string}
            />
          </Suspense>
        </div>
        <div className="flex flex-col gap-4">
          <Suspense
            fallback={
              <PhysPyConfigCardSkeleton perfYear={perfYear as string} />
            }
          >
            <PhysPyConfigCardServer
              userId={user.userId}
              physPubId={slug as string}
              perfYearUrl={perfYear ? (perfYear as string) : undefined}
            />
          </Suspense>
          <Suspense fallback={<PhysEntityPaymentMethodCardSkeleton />}>
            <PhysEntityPaymentMethodCardServer
              userId={user.userId}
              physPubId={slug as string}
            />
          </Suspense>
        </div>
      </div>
    </RestrictByUserAppAttrsServer>
  );
}
