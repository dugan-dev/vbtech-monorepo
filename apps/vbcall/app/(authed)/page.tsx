import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { RateLimit } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { getClientIpFromHeaders } from "@workspace/ui/utils/get-client-ip";
import { checkPageRateLimit } from "@workspace/ui/utils/rate-limit/check-page-rate-limit";

import { StandardLayout } from "@/components/standard-layout";

/**
 * Serves the home page for authenticated users within rate limits.
 *
 * Enforces rate limiting and user authentication before rendering the home page. Returns an unauthorized response if the user is not authenticated.
 */
export default async function Page() {
  await checkPageRateLimit({
    config: {
      getHeaders: headers,
      redirect,
      getRateLimitRoute: () => RateLimit({}),
      authenticatedUser,
      getClientIp: getClientIpFromHeaders,
    },
  });

  const user = await authenticatedUser();

  if (!user) {
    return unauthorized();
  }

  return (
    <StandardLayout>
      <h1>Home</h1>
    </StandardLayout>
  );
}
