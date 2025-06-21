import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { RateLimit } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { getClientIP } from "@workspace/ui/utils/get-client-ip";
import { checkPageRateLimit } from "@workspace/ui/utils/rate-limit/check-page-rate-limit";

import { UserRole } from "@/types/user-role";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const REQUIRED_USER_ROLES: UserRole[] = ["read-notifications"];

function getClientIpFromHeaders(headers: Headers) {
  const plainHeaders = Object.fromEntries(headers.entries());
  return getClientIP(plainHeaders) || "unknown";
}

/**
 * Renders the Notification Detail page with access control.
 *
 * This server-side component extracts the notification slug from the resolved parameters and concurrently checks for
 * rate limiting and user authentication. If the user is not authenticated, it returns an unauthorized response. Otherwise,
 * it renders the notification details within a component that restricts access based on required user roles.
 *
 * @param params - A promise that resolves to an object containing the notification slug.
 *
 * @returns A component displaying the notification detail content or an unauthorized response.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({
      pathname: `/share/notifications/${slug}`,
      config: {
        getHeaders: headers,
        redirect,
        getRateLimitRoute: () => RateLimit({}),
        authenticatedUser,
        getClientIp: getClientIpFromHeaders,
      },
    }),
  ]);

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      userId={user.userId}
      requiredUserRoles={REQUIRED_USER_ROLES}
    >
      <h1>Notification Detail</h1>
    </RestrictByUserAppAttrsServer>
  );
}
