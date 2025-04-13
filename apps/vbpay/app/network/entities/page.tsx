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
 * Renders the network entities management page.
 *
 * This server component concurrently retrieves the route's query parameters and the authenticated user,
 * and applies a rate limit check based on the network entities pathname. If the user is not authenticated,
 * it returns an unauthorized response. Otherwise, it renders the ManageNetworkEntities component within
 * a wrapper that restricts access to allowed user types.
 *
 * @param searchParams - A promise resolving to an object containing the route's query parameters.
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
