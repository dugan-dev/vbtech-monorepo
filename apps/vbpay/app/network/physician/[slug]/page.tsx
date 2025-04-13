import "server-only";

import { unauthorized } from "next/navigation";
import { NetworkPhysician } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer", "physician"];

/**
 * Renders the Network Physician page with authentication and rate limiting checks.
 *
 * This asynchronous function awaits a promise that resolves to an object containing a slug,
 * which is then used to concurrently validate the user's authentication status and enforce rate limiting.
 * If the user is not authenticated, it returns an unauthorized response; otherwise, it renders the page
 * within a restricted component that enforces access control based on allowed user types.
 *
 * @param params - A promise resolving to an object with a slug used for routing and rate limit verification.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: NetworkPhysician({ slug }) }),
  ]);

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <h1>Network Physician</h1>
    </RestrictByUserAppAttrsServer>
  );
}
