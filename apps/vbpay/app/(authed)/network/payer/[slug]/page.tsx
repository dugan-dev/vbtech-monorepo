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
 * Renders the payer configuration page for authenticated users with permitted roles.
 *
 * Awaits query and route parameters as well as user authentication, enforces rate limiting, and restricts access to users with allowed roles. Displays payer information, configuration, and processing account sections, each with a loading skeleton while data is being fetched.
 *
 * @returns The payer configuration page as a JSX element, or an unauthorized response if the user is not authenticated.
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
          <PayerInfoCardServer payerPubId={slug} />
        </Suspense>
        <Suspense
          fallback={<PayerPyConfigCardSkeleton perfYear={perfYear as string} />}
        >
          <PayerPyConfigCardServer
            perfYearUrl={perfYear ? (perfYear as string) : undefined}
            payerPubId={slug}
          />
        </Suspense>
        <Suspense fallback={<PayerProcessingAccountCardSkeleton />}>
          <PayerProcessingAccountCardServer payerPubId={slug} />
        </Suspense>
      </div>
    </RestrictByUserAppAttrsServer>
  );
}
