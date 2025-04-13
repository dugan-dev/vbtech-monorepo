import { redirect, unauthorized } from "next/navigation";
import { getVBPayLicense } from "@/repos/license-repository";
import { Home, Setup } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { StandardLayout } from "@/components/standard-layout";

/**
 * Renders the home page based on user authentication and license validation.
 *
 * This asynchronous function first applies a rate limit check using the home route's pathname.
 * It concurrently retrieves the authenticated user and the VBPay license. If no authenticated user 
 * is found, it returns an unauthorized response; if the user is authenticated but the license is missing,
 * it redirects to the setup page. Otherwise, it renders the home page content within a standard layout.
 *
 * @returns A JSX element with the home page layout, or a response indicating unauthorized access or a redirect.
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
