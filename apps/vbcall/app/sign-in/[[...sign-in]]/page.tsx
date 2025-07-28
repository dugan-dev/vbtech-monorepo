import { redirect } from "next/navigation";
import { Home, SignIn as SignInRoute } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

import { SignInWrapper } from "@/components/auth/sign-in-wrapper";

/**
 * Renders the sign-in page or redirects to the home page if the user is authenticated.
 *
 * This function concurrently checks for user authentication and applies rate-limiting restrictions
 * on accessing the sign-in page. If a user is already authenticated, it redirects them to the home page;
 * otherwise, it renders the sign-in interface.
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
      <SignInWrapper />
    </main>
  );
}
