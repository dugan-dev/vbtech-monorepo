import { unauthorized } from "next/navigation";
import { ShareNotificationDetail } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserRole } from "@/types/user-role";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const REQUIRED_USER_ROLES: UserRole[] = ["read-notifications"];

/**
 * Renders a notification detail page after verifying authentication and rate limiting.
 *
 * This asynchronous server component awaits a promise resolving to a parameter object containing a notification identifier ("slug"). 
 * It concurrently checks for a valid, authenticated user and validates that the page can be accessed based on rate limiting. 
 * If the user is not authenticated, an unauthorized response is returned; otherwise, the component renders the notification detail 
 * within an access-restricted container enforcing the required user roles.
 *
 * @param params - A promise that resolves to an object with a "slug" property identifying the notification detail.
 *
 * @returns A React element representing the restricted notification detail page or an unauthorized response.
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
