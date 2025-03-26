import { forbidden } from "next/navigation";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { UserRole } from "@/types/user-role";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const REQUIRED_USER_ROLES: UserRole[] = ["read-notifications"];

export default async function Page() {
  const user = await authenticatedUser();

  if (!user) {
    return forbidden();
  }

  return (
    <RestrictByUserAppAttrsServer
      userId={user.userId}
      requiredUserRoles={REQUIRED_USER_ROLES}
    >
      <h1>Recent Notifications</h1>
    </RestrictByUserAppAttrsServer>
  );
}
