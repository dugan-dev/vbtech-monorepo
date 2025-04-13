import { ManageNetworkPhysicians } from "./components/manage-network-physicians";

import "server-only";

import { unauthorized } from "next/navigation";
import { NetworkPhysicians } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the network physicians management page after enforcing rate limits and authenticating the user.
 *
 * This asynchronous function first applies a rate limit check based on the pathname obtained from {@link NetworkPhysicians}.
 * It then concurrently retrieves the URL search parameters and authenticates the user. If the user is not authenticated,
 * an unauthorized response is returned. Otherwise, it renders the network physicians management interface within
 * a component that restricts access to allowed user types.
 *
 * @param searchParams - A promise that resolves to an object containing URL search parameters, including the payer ID.
 *
 * @returns A React component displaying the network physicians management interface for authenticated users,
 *          or an unauthorized response if the user is not authenticated.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // check page rate limit
  await checkPageRateLimit({ pathname: NetworkPhysicians({}) });

  const [{ pId }, user] = await Promise.all([
    searchParams,
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
      <ManageNetworkPhysicians
        payerIdUrlParam={pId as string}
        userId={user.userId}
      />
    </RestrictByUserAppAttrsServer>
  );
}
