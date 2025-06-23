import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RateLimit } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { SignInPage } from "@workspace/ui/components/auth/sign-in-page";
import { getClientIpFromHeaders } from "@workspace/ui/utils/get-client-ip";
import { checkPageRateLimit } from "@workspace/ui/utils/rate-limit/check-page-rate-limit";

import { Icons } from "@/components/icons";

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
    return redirect("/");
  }

  return (
    <SignInPage
      Logo={<Icons.logo height={80} width={150} />}
      LogoDark={<Icons.logoDark height={80} width={150} />}
      LoaderIcon={<Icons.loader className="mr-2 h-4 w-4 animate-spin" />}
    />
  );
}
