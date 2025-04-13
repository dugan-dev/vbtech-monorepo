import { redirect, unauthorized } from "next/navigation";
import { getVBPayLicense } from "@/repos/license-repository";
import { Home, Setup } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { StandardLayout } from "@/components/standard-layout";

/**
 * Renders the home page after validating rate limits, user authentication, and license availability.
 *
 * This asynchronous function first enforces a rate limit on page requests using the current home route.
 * It then concurrently retrieves the authenticated user and the VBPay license. If the user is not
 * authenticated, it returns an unauthorized response. If the user exists but lacks an active license,
 * it redirects to the setup page. Otherwise, it renders the home page within a standard layout.
 *
 * @returns A server response that is either the home page in a standard layout, a redirection to the setup page, or an unauthorized response.
 */
export default async function Page() {
  await checkPageRateLimit({ pathname: Home({}) });

  const [user, license] = await Promise.all([
    authenticatedUser(),
    getVBPayLicense(),
  ]);

  if (!user) {
    return unauthorized();
  }

  if (!license) {
    return redirect(Setup({}));
  }

  return (
    <StandardLayout>
      <h1>Home</h1>
    </StandardLayout>
  );
}
