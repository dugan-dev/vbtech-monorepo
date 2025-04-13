import { getVBPayLicense } from "@/repos/license-repository";

import "server-only";

import { redirect } from "next/navigation";
import { Home, Setup, SignIn } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { NotSetupView } from "./components/not-setup-view";

/**
 * Renders the page based on rate limiting, user authentication, and licensing status.
 *
 * This asynchronous server-side component first enforces a rate limit using the setup route. It then concurrently
 * checks for an authenticated user and if the application is licensed. Depending on these evaluations:
 * - Unauthenticated users are redirected to the sign-in page.
 * - Licensed users are redirected to the home page.
 * - Authenticated users without a license see the NotSetupView component rendered with their user ID.
 *
 * @returns A redirection response or the rendered NotSetupView component.
 */
export default async function Page() {
  // Check rate limiter
  await checkPageRateLimit({ pathname: Setup({}) });

  // check if user is signed in and if the app is licensed.
  const [license, user] = await Promise.all([
    getVBPayLicense(),
    authenticatedUser(),
  ]);

  // If the user is not signed in, redirect them to the sign in page
  if (!user) {
    return redirect(SignIn({}));
  }

  // If the app is licensed, redirect them to the home page
  if (license) {
    return redirect(Home({}));
  }

  return <NotSetupView userId={user.userId} />;
}
