import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { NetworkPhysician } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

import { PhysicianInfoCardSkeleton } from "./components/info/physician-info-card-skeleton";
import { PhysicianInfoCardServer } from "./components/info/physician-info-card.server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer", "physician"];

/**
 * Renders the Network Physician page as a server-side component.
 *
 * This asynchronous function extracts the page slug from the provided promise, then concurrently verifies
 * the user's authentication and checks the page's rate limit by generating a pathname via {@link NetworkPhysician}.
 * If the user is not authenticated, it returns an unauthorized response; otherwise, it renders the page within
 * a restricted-access component that limits viewability based on allowed user types.
 *
 * @param params - A promise that resolves to an object containing the page's slug.
 *
 * @returns A React element representing the page content if the user is authenticated, or an unauthorized response otherwise.
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
      <Suspense fallback={<PhysicianInfoCardSkeleton />}>
        <PhysicianInfoCardServer userId={user.userId} pubId={slug as string} />
      </Suspense>
    </RestrictByUserAppAttrsServer>
  );
}
