import { ManagePayers } from "./components/manage-payers";

import "server-only";

import { unauthorized } from "next/navigation";
import { NetworkPayers } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the payer management page after authenticating the user and verifying the page rate limit.
 *
 * This function concurrently authenticates the user and checks the page's rate limit. If the user is not authenticated,
 * it immediately returns an unauthorized response. Otherwise, it renders the ManagePayers component within a restricted
 * access container that enforces allowed user attributes.
 *
 * @returns A page component displaying the payer management interface for authenticated users or an unauthorized response.
 */
export default async function Page() {
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: NetworkPayers({}) }),
  ]);

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <ManagePayers userId={user.userId} />
    </RestrictByUserAppAttrsServer>
  );
}
