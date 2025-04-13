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
 * Renders the network physicians management page.
 *
 * This asynchronous function first enforces a rate limit by checking the current page's
 * pathname, then concurrently retrieves URL search parameters and the authenticated user.
 * If no user is authenticated, it returns an unauthorized response. Otherwise, it renders
 * the ManageNetworkPhysicians component wrapped with a restriction component that limits
 * access based on allowed user types.
 *
 * @param searchParams - A promise that resolves to an object containing URL query parameters.
 *
 * @returns A React element representing the content of the page or the unauthorized response.
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
