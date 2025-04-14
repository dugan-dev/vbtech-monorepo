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
 * Server-side React component for the Network Physician page with authentication, access control, and rate limiting.
 *
 * Awaits the provided `params` promise to extract the page slug, verifies user authentication, and enforces rate limits. If the user is authenticated, renders the physician info card within a restricted-access wrapper and a suspense boundary for loading states; otherwise, returns an unauthorized response.
 *
 * @param params - Promise resolving to an object containing the page's slug.
 *
 * @returns The rendered page content for authorized users, or an unauthorized response for unauthenticated access.
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
