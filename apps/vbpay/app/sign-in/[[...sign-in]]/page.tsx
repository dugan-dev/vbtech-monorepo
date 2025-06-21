import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Home, RateLimit } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { getClientIP } from "@workspace/ui/utils/get-client-ip";
import { checkPageRateLimit } from "@workspace/ui/utils/rate-limit/check-page-rate-limit";

import { SignInCard } from "./components/sign-in-card";

// Adapter function to convert Headers to plain object for getClientIP
function getClientIpFromHeaders(headers: Headers) {
  const plainHeaders = Object.fromEntries(headers.entries());
  return getClientIP(plainHeaders) || "unknown";
}

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
    checkPageRateLimit({
      pathname: "/sign-in",
      config: {
        getHeaders: headers,
        redirect,
        getRateLimitRoute: () => RateLimit({}),
        authenticatedUser,
        getClientIp: getClientIpFromHeaders,
      },
    }),
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
