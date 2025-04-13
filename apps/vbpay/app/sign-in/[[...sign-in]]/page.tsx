import { redirect } from "next/navigation";
import { Home, SignIn as SignInRoute } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { SignInCard } from "./components/sign-in-card";

/**
 * Renders the sign-in page if no user is authenticated, or redirects authenticated users to the home page.
 *
 * This asynchronous component concurrently checks for an authenticated user and verifies the page rate limit. 
 * If a user is authenticated, it triggers a redirect to the home page; otherwise, it displays a centered sign-in card.
 */
export default async function SignIn() {
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: SignInRoute({}) }),
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
