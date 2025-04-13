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
 * Renders the payer configuration page for authenticated users.
 *
 * This asynchronous server component concurrently resolves query parameters, route parameters, and the authenticated user. It enforces a rate limit check based on the payer's slug before verifying authentication. Unauthenticated users receive an unauthorized response.
 *
 * Authenticated users with valid application attributes are presented with a two-column layout:
 * - The first column displays payer details via an information card wrapped in a Suspense component that shows a loading skeleton.
 * - The second column shows configuration settings (optionally tied to a performance year) via a configuration card, also wrapped in Suspense with a fallback skeleton.
 *
 * @param searchParams - A promise resolving to an object of query parameters, such as the performance year.
 * @param params - A promise resolving to an object of route parameters, including the payer's slug.
 *
 * @returns A JSX element rendering the payer configuration page or an unauthorized response.
 *
 * @throws {Error} If the page rate limit is exceeded.
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
