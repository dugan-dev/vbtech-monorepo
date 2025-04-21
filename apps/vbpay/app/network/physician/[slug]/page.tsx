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

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer", "physician"];

/**
 * Renders the physician page with access control, displaying physician information, affiliates, and payment methods.
 *
 * Restricts access to authenticated users with allowed user types and enforces rate limiting. Shows loading skeletons while data is being fetched.
 *
 * @param params - A promise resolving to an object containing the physician's public slug.
 * @returns The server-rendered physician page or an unauthorized response if the user is not authenticated.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [user] = await Promise.all([
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
