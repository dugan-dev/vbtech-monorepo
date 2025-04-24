import { unauthorized } from "next/navigation";
import { Home } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { StandardLayout } from "@/components/standard-layout";

/**
 * Renders the home page if the user is authenticated and within rate limits.
 *
 * Enforces a rate limit for the home page and checks for an authenticated user. Returns an unauthorized response if authentication fails; otherwise, displays the home page content.
 */
export default async function Page() {
  await checkPageRateLimit({ pathname: Home({}) });

  const user = await authenticatedUser();

  if (!user) {
    return unauthorized();
  }

  return (
    <StandardLayout>
      <h1>Home</h1>
    </StandardLayout>
  );
}
