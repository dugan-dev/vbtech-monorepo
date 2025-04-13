import { unauthorized } from "next/navigation";
import { ShareNotificationDetail } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserRole } from "@/types/user-role";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const REQUIRED_USER_ROLES: UserRole[] = ["read-notifications"];

/**
 * Renders the notification detail page for authenticated users.
 *
 * This asynchronous server-side function awaits a promise to extract the notification slug,
 * concurrently verifies user authentication and applies a rate limit check based on the notification's detail route,
 * and then conditionally renders the page content. If no user is authenticated, it returns an unauthorized response.
 *
 * @param params - An object containing a promise that resolves to an object with a `slug` property.
 * @returns A restricted component displaying the notification detail if authenticated, or an unauthorized response.
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
