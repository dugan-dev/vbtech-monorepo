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
 * Renders a page with authentication, rate limiting, and conditional UI rendering.
 *
 * This asynchronous function concurrently retrieves the authenticated user and the route parameter
 * containing the network entity's slug. It enforces a rate limit by checking access using the slug-derived
 * pathname before verifying user authentication. If the user is not authenticated, an unauthorized response
 * is returned. Otherwise, the page is rendered with restricted access based on allowed user types and lazy-loaded
 * entity details.
 *
 * @param params - A promise resolving to an object containing the "slug" that identifies the network entity.
 * @returns A React element representing the page or an unauthorized response.
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
