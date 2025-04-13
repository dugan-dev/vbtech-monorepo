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
 * Renders the network entities management page with authentication and rate limiting.
 *
 * This server-side component concurrently retrieves URL search parameters and the authenticated user. It
 * enforces rate limits based on the current pathname before checking authentication. If no authenticated user
 * is found, it returns an unauthorized response; otherwise, it renders the ManageNetworkEntities view wrapped
 * in a restriction component that validates user attributes.
 *
 * @param searchParams - A promise that resolves to an object of URL query parameters, including the payer ID.
 * @returns A React element representing either an unauthorized response or the restricted management view.
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
