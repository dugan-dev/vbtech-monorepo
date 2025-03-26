import "server-only";

import { unauthorized } from "next/navigation";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo"];

export default async function Page() {
  const user = await authenticatedUser();

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <h1>Work by Queue</h1>
    </RestrictByUserAppAttrsServer>
  );
}
