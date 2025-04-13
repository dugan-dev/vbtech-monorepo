import "server-only";

import { unauthorized } from "next/navigation";
import { Beneficiary } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the beneficiary page after validating the user's authentication and rate limit.
 *
 * This server-side component extracts the beneficiary slug from the provided route parameters and concurrently checks the user's authentication status and applies rate limiting based on the slug's path. If the user is not authenticated, it returns an unauthorized response. Otherwise, it renders the page within an access-restricted component that limits access to allowed user types.
 *
 * @param params - An object containing a promise that resolves to an object with a `slug` string.
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
