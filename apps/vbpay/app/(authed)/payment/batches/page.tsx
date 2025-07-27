import "server-only";

import { unauthorized } from "next/navigation";
import { ManagePaymentBatches } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the Manage Batches page, allowing access only to authenticated users with permitted user types.
 *
 * Applies rate limiting and restricts page content to users whose type is included in {@link ALLOWED_USER_TYPES}. Unauthorized users receive an immediate unauthorized response.
 *
 * @returns The restricted Manage Batches page for eligible users, or an unauthorized response if access is denied.
 */
export default async function Page() {
  // Check rate limiter
  const user = await authenticatedUser();
  await checkPageRateLimit({ pathname: ManagePaymentBatches({}), user });

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <h1>Manage Batches</h1>
    </RestrictByUserAppAttrsServer>
  );
}
