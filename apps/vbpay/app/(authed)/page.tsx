import { unauthorized } from "next/navigation";
import { Home } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { StandardLayout } from "@/components/standard-layout";

/**
 * Serves the home page for authenticated users who have not exceeded rate limits.
 *
 * Enforces rate limiting and authentication before rendering the home page. Returns an unauthorized response if the user is not authenticated.
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
