import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { NetworkEntity } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
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
 * Renders the entity information page with user authentication and rate limit enforcement.
 *
 * This asynchronous page function concurrently retrieves the authenticated user and the route's slug,
 * applies a rate limit based on the derived network entity pathname, and conditionally renders content
 * based on the user's authentication status. If no user is authenticated, an unauthorized response is returned.
 *
 * @param params - A promise that resolves to an object containing the route's `slug` used to identify the entity.
 * @returns The rendered page as a React element if the user is authenticated; otherwise, an unauthorized response.
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
      <Suspense fallback={<EntityInfoCardSkeleton />}>
        <EntityInfoCardServer
          userId={user.userId}
          entityPubId={slug as string}
        />
      </Suspense>
    </RestrictByUserAppAttrsServer>
  );
}
