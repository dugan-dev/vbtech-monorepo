import "server-only";

import { unauthorized } from "next/navigation";
import { AdminUsers } from "@/routes";
import { checkPageRateLimit } from "@/utils/rate-limiting";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

export default async function Page() {
  // Check rate limiter
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: AdminUsers({}) }),
  ]);

  if (!user) {
    return unauthorized();
  }

  return <div>Call Log Page</div>;
}
