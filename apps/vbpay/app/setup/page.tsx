import { getVBPayLicense } from "@/repos/license-repository";

import "server-only";

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Home, Setup, SignIn } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { NotSetupView } from "./components/not-setup-view";
import { NotSetupViewSkeleton } from "./components/not-setup-view-skeleton";

/**
 * Handles the page request by enforcing rate limits and determining the appropriate response based on user authentication and license status.
 *
 * The function starts by checking if the page access complies with rate limiting rules. It then concurrently retrieves the application license and the authenticated user.
 * If no user is authenticated, it redirects to the sign-in page.
 * If a valid license is present, it redirects to the home page.
 * Otherwise, it renders the NotSetupView component, passing the authenticated user's ID.
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

  return (
    <Suspense fallback={<NotSetupViewSkeleton />}>
      <NotSetupView userId={user.userId} />
    </Suspense>
  );
}
