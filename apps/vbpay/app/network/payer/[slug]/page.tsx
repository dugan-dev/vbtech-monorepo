import "server-only";

import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { authenticatedUser } from "@/utils/amplify-server-utils";

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
 * This asynchronous server component concurrently retrieves search parameters, route parameters, and the authenticated user.
 * If the user is not authenticated, it returns an unauthorized response. For valid users, it restricts access based on allowed user types
 * and displays the payer configuration card with a loading skeleton fallback while the configuration data loads.
 *
 * @param searchParams - A promise that resolves to an object containing query parameters (including the performance year).
 * @param params - A promise that resolves to an object containing route parameters (including the payer's slug).
 *
 * @returns A JSX element representing the rendered page or an unauthorized response.
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
