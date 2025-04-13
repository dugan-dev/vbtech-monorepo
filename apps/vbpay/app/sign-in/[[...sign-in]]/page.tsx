import { redirect } from "next/navigation";
import { Home, SignIn } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { SignInCard } from "./components/sign-in-card";

/**
 * Renders the sign-in page or redirects authenticated users to the home page.
 *
 * This asynchronous function concurrently checks for an authenticated user and verifies the
 * page rate limit for the sign-in route. If a user is authenticated, it redirects to the home page.
 * Otherwise, it returns a main layout that centers the sign-in interface.
 */
export default async function Page() {
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: SignIn({}) }),
  ]);

  if (user) {
    return redirect(Home({}));
  }
  return (
    <main className="flex min-h-screen items-center justify-center">
      <SignInCard />
    </main>
  );
}
