import "server-only";

import { unauthorized } from "next/navigation";
import { NetworkPhysician } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer", "physician"];

/**
 * Renders the Network Physician page with access control based on user authentication and rate limits.
 *
 * This asynchronous server component extracts a slug from a provided promise, then concurrently authenticates the user
 * and checks the page's rate limit using that slug to generate the pathname. If no user is authenticated, it returns
 * an unauthorized response; otherwise, it renders the page wrapped in a component that restricts access to allowed user types.
 *
 * @param params - A promise that resolves to an object containing the slug used for generating the page's pathname.
 * @returns The rendered page component if authenticated, or an unauthorized response if the user is not authenticated.
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
