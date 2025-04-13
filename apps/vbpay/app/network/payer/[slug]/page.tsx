import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { NetworkPayer } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

import { PayerInfoCardSkeleton } from "./components/info/payer-info-card-skeleton";
import { PayerInfoCardServer } from "./components/info/payer-info-card.server";
import { PayerPyConfigCardSkeleton } from "./components/py-config/payer-py-config-card-skeleton";
import { PayerPyConfigCardServer } from "./components/py-config/payer-py-config-card.server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the payer configuration page for authenticated users and enforces rate limiting.
 *
 * This asynchronous server component concurrently resolves query parameters, route parameters, and the authenticated user.
 * Before verifying authentication, it ensures the request complies with rate limiting by checking the route's limit based on the payer's slug.
 * If no authenticated user is found, it returns an unauthorized response.
 * For authenticated users, it restricts access based on allowed user types and displays a two-column layout:
 * one column shows payer information while the other presents configuration settings for a specified performance year.
 * Each section is wrapped in a Suspense component that renders a loading skeleton until its data loads.
 *
 * @param searchParams - A promise resolving to an object containing query parameters, such as the performance year.
 * @param params - A promise resolving to an object containing route parameters, including the payer's slug.
 *
 * @returns A JSX element representing the payer configuration page or an unauthorized response.
 */
export default async function Page({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ slug: string }>;
}) {
  const [{ perfYear }, { slug }, user] = await Promise.all([
    searchParams,
    params,
    authenticatedUser(),
  ]);

  // check page rate limit
  await checkPageRateLimit({ pathname: NetworkPayer({ slug }) });

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <div className="flex gap-4">
        <Suspense fallback={<PayerInfoCardSkeleton />}>
          <PayerInfoCardServer userId={user.userId} payerPubId={slug} />
        </Suspense>
        <Suspense fallback={<PayerPyConfigCardSkeleton />}>
          <PayerPyConfigCardServer
            userId={user.userId}
            perfYearUrl={perfYear ? (perfYear as string) : undefined}
            payerPubId={slug}
          />
        </Suspense>
      </div>
    </RestrictByUserAppAttrsServer>
  );
}
