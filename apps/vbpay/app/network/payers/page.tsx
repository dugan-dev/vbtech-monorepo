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
 * Renders the payer management page for authenticated users with allowed roles.
 *
 * This asynchronous function concurrently verifies the user's authentication status and enforces the page's rate limit.
 * If the user is not authenticated, it returns an unauthorized response. Otherwise, it renders the payer management
 * interface within a component that restricts access based on allowed user attributes.
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
