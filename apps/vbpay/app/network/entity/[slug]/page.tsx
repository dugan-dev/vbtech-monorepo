import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { NetworkEntity } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { PhysEntityPaymentMethodCardSkeleton } from "@/components/phys-entity-payment-method-card/phys-entity-payment-method-card-skeleton";
import { PhysEntityPaymentMethodCardServer } from "@/components/phys-entity-payment-method-card/phys-entity-payment-method-card.server";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

import { EntityInfoCardSkeleton } from "./components/info/entity-info-card-skeleton";
import { EntityInfoCardServer } from "./components/info/entity-info-card.server";

const ALLOWED_USER_TYPES: UserType[] = [
  "bpo",
  "payers",
  "payer",
  "po",
  "facility",
  "practice",
  "physician",
  "vendor",
];

/**
 * Displays a network entity page with access restricted to authenticated users of allowed types and enforces rate limiting.
 *
 * Retrieves the authenticated user and entity slug concurrently, applies rate limiting based on the entity path, and renders entity details and payment method information. Returns an unauthorized response if the user is not authenticated.
 *
 * @param params - A promise resolving to an object containing the network entity slug.
 *
 * @returns The network entity page as a React element, or an unauthorized response if the user is not authenticated.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [user, { slug }] = await Promise.all([authenticatedUser(), params]);

  // check page rate limit
  await checkPageRateLimit({ pathname: NetworkEntity({ slug }) });

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <div className="flex-1 flex flex-col space-y-4">
        <Suspense fallback={<EntityInfoCardSkeleton />}>
          <EntityInfoCardServer
            userId={user.userId}
            entityPubId={slug as string}
          />
        </Suspense>
        <Suspense fallback={<PhysEntityPaymentMethodCardSkeleton />}>
          <PhysEntityPaymentMethodCardServer
            userId={user.userId}
            entityPubId={slug as string}
          />
        </Suspense>
      </div>
    </RestrictByUserAppAttrsServer>
  );
}
