import { ManageNetworkPhysicians } from "./components/manage-network-physicians";

import "server-only";

import { unauthorized } from "next/navigation";
import { NetworkPhysicians } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // check page rate limit
  await checkPageRateLimit({ pathname: NetworkPhysicians({}) });

  const [{ pId }, user] = await Promise.all([
    searchParams,
    authenticatedUser(),
  ]);

  if (!user) {
    return unauthorized();
  }

  return (
    <RestrictByUserAppAttrsServer
      allowedUserTypes={ALLOWED_USER_TYPES}
      userId={user.userId}
    >
      <ManageNetworkPhysicians
        payerIdUrlParam={pId as string}
        userId={user.userId}
      />
    </RestrictByUserAppAttrsServer>
  );
}
