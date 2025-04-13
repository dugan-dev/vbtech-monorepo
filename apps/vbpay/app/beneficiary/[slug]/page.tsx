import "server-only";

import { unauthorized } from "next/navigation";
import { Beneficiary } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders a beneficiary page by concurrently validating user authentication and rate limiting.
 *
 * Awaits a promise to extract the beneficiary slug and checks if the current user is authenticated.
 * If authenticated, the function renders the beneficiary page with access restrictions;
 * otherwise, it returns an unauthorized response.
 *
 * @param params - A promise that resolves to an object containing the beneficiary slug.
 *
 * @returns A React element representing the beneficiary page or an unauthorized response.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: Beneficiary({ slug }) }),
  ]);

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <h1>Beneficiary</h1>
    </RestrictByUserAppAttrsServer>
  );
}
