import { unauthorized } from "next/navigation";
import { Home } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { StandardLayout } from "@/components/standard-layout";

/**
 * Renders the home page component based on user authentication and license status.
 *
 * This asynchronous function first enforces a rate limit for the home page by checking the current pathname
 * derived from the Home route. It then concurrently retrieves the authenticated user and VBPay license.
 * If no authenticated user is found, it returns an unauthorized response. If a user is authenticated but no
 * VBPay license is present, it redirects to the setup page. When both checks pass, it renders the home page
 * within a standard layout.
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
