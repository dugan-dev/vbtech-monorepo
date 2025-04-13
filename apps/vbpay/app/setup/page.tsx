import { getVBPayLicense } from "@/repos/license-repository";

import "server-only";

import { redirect } from "next/navigation";
import { Home, Setup, SignIn } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { NotSetupView } from "./components/not-setup-view";

/**
 * Handles page access by enforcing rate limits and verifying both user authentication and application licensing.
 *
 * This asynchronous function first enforces a rate limit based on the setup route pathname. It then concurrently
 * checks for an existing application license and an authenticated user. If no user is authenticated, it redirects to the
 * sign-in page. If the application is licensed, it redirects to the home page. Otherwise, it renders the NotSetupView
 * component, passing the authenticated user's ID.
 *
 * @returns A redirect response if the user is unauthenticated or the app is licensed; otherwise, the NotSetupView component.
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
