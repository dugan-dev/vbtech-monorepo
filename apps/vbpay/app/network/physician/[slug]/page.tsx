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
