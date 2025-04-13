import { ManageNetworkEntities } from "./components/manage-network-entities";

import "server-only";

import { unauthorized } from "next/navigation";
import { NetworkEntities } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the server-side page for managing network entities with access restrictions.
 *
 * This component retrieves URL search parameters and the authenticated user concurrently.
 * It enforces a rate limit based on the network entities route before verifying authentication.
 * If the user is not authenticated, an unauthorized response is returned.
 * Otherwise, it renders a restricted view that wraps the network management interface within a user attribute restriction.
 *
 * @param searchParams - A promise resolving to an object containing URL search parameters.
 * @returns A JSX element representing the restricted network management page, or an unauthorized response.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [{ pId }, user] = await Promise.all([
    searchParams,
    authenticatedUser(),
  ]);

  // check page rate limit
  await checkPageRateLimit({ pathname: NetworkEntities({}) });

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <ManageNetworkEntities
        payerIdUrlParam={pId as string}
        userId={user.userId}
      />
    </RestrictByUserAppAttrsServer>
  );
}
