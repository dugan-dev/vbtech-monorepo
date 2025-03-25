import { UserManagement } from "./component/user-management";

import "server-only";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo"];

export default async function Page() {
  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      adminOnly
    >
      <UserManagement />
    </RestrictByUserAppAttrsServer>
  );
}
