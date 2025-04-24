import { unauthorized } from "next/navigation";
import { Home } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { StandardLayout } from "@/components/standard-layout";

/**
 * Serves the home page for authenticated users within rate limits.
 *
 * Enforces rate limiting and user authentication before rendering the home page. Returns an unauthorized response if the user is not authenticated.
 *
 * @returns The home page content for authenticated users, or an unauthorized response if authentication fails.
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
