import { unauthorized } from "next/navigation";
import { ShareNotificationDetail } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

import { UserRole } from "@/types/user-role";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const REQUIRED_USER_ROLES: UserRole[] = ["read-notifications"];

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

  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: ShareNotificationDetail({ slug }) }),
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
