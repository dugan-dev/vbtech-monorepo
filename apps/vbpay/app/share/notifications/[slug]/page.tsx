import { unauthorized } from "next/navigation";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { UserRole } from "@/types/user-role";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const REQUIRED_USER_ROLES: UserRole[] = ["read-notifications"];

export default async function Page() {
  const user = await authenticatedUser();

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
