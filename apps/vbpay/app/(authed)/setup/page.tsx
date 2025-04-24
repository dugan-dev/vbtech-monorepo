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
 * React server component for the setup page that enforces rate limits, checks user authentication, and verifies license status.
 *
 * Redirects unauthenticated users to the sign-in page and users with a valid license to the home page. If the user is authenticated but no license is present, renders the setup view within a suspense boundary that displays a loading skeleton while loading.
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
      <NotSetupView />
    </Suspense>
  );
}
