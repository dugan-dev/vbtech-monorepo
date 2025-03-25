import "server-only";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer", "physician"];

export default async function Page() {
  return (
    <RestrictByUserAppAttrsServer allowedUserTypes={ALLOWED_USER_TYPES}>
      <h1>Network Physician</h1>
    </RestrictByUserAppAttrsServer>
  );
}
