import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { authenticatedUser } from "@/utils/amplify-server-utils";

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
 * Renders the network entity page for authenticated and authorized users.
 *
 * This asynchronous component concurrently obtains the authenticated user and the entity slug.
 * If the user is not authenticated, it returns an unauthorized response.
 * Otherwise, it wraps the entity information display within an access restriction component,
 * and uses a suspense fallback while loading the entity details.
 *
 * @param params - A promise that resolves to an object containing a slug used to identify the entity.
 *
 * @returns The page component displaying the entity information or an unauthorized response.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [user, { slug }] = await Promise.all([authenticatedUser(), params]);

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
