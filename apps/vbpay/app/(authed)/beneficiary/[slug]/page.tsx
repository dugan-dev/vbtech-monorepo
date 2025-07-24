import "server-only";

import { unauthorized } from "next/navigation";
import { Beneficiary } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

/**
 * Renders the Beneficiary page for authenticated users with rate limits enforced.
 *
 * This server component awaits a promise resolving to a parameters object containing the page slug, then concurrently
 * performs user authentication and a rate limit check based on the generated pathname. If the user is not authenticated,
 * it returns an unauthorized response. Otherwise, it renders the Beneficiary page wrapped in a component that restricts
 * access according to allowed user types.
 *
 * @param params A promise that resolves to an object with a slug property used to generate the page pathname.
 * @returns A React element representing the Beneficiary page or an unauthorized response.
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
