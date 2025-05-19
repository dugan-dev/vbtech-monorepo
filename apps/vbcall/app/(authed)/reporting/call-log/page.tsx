import "server-only";

import { unauthorized } from "next/navigation";
import { AdminUsers } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

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
