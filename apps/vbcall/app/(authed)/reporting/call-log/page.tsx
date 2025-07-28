import "server-only";

import { unauthorized } from "next/navigation";
import { AdminUsers } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

export default async function Page() {
  // Get user first, then check rate limiter with user context
  const user = await authenticatedUser();
  await checkPageRateLimit({ pathname: AdminUsers({}), user });

  if (!user) {
    return unauthorized();
  }

  return <div>Call Log Page</div>;
}
