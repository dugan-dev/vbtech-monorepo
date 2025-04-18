import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { NetworkPayer } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

import { PayerProcessingAccountCardSkeleton } from "./components/banking/payer-processing-account-card-skeleton";
import { PayerProcessingAccountCardServer } from "./components/banking/payer-processing-account-card.server";
import { PayerInfoCardSkeleton } from "./components/info/payer-info-card-skeleton";
import { PayerInfoCardServer } from "./components/info/payer-info-card.server";
import { PayerPyConfigCardSkeleton } from "./components/py-config/payer-py-config-card-skeleton";
import { PayerPyConfigCardServer } from "./components/py-config/payer-py-config-card.server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the payer configuration page for authenticated users.
 *
 * This asynchronous server component concurrently resolves query parameters, route parameters, and the authenticated user.
 * It then enforces a page rate limit based on the payer network route (derived from the provided slug) before proceeding.
 * If the user is not authenticated, the component returns an unauthorized response.
 * For authenticated users, access is restricted based on allowed user types and a two-column layout is rendered:
 * one column displays payer details via an information card, and the other shows configuration settings (optionally based on a performance year)
 * via a configuration card. Each card is wrapped in a Suspense component with a skeleton fallback while data loads.
 *
 * @param searchParams - Promise resolving to an object containing query parameters (e.g., performance year).
 * @param params - Promise resolving to an object containing route parameters, including the payer's slug.
 *
 * @returns A JSX element rendering the payer configuration page or an unauthorized response.
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
      <div className="flex-1 flex flex-col space-y-4">
        <Suspense fallback={<PayerInfoCardSkeleton />}>
          <PayerInfoCardServer userId={user.userId} payerPubId={slug} />
        </Suspense>
        <Suspense
          fallback={<PayerPyConfigCardSkeleton perfYear={perfYear as string} />}
        >
          <PayerPyConfigCardServer
            userId={user.userId}
            perfYearUrl={perfYear ? (perfYear as string) : undefined}
            payerPubId={slug}
          />
        </Suspense>
        <Suspense fallback={<PayerProcessingAccountCardSkeleton />}>
          <PayerProcessingAccountCardServer
            userId={user.userId}
            payerPubId={slug}
          />
        </Suspense>
      </div>
    </RestrictByUserAppAttrsServer>
  );
}
