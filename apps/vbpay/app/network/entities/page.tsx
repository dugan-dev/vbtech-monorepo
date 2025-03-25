import { ManageNetworkEntities } from "./components/manage-network-entities";

import "server-only";

import { UserType } from "@/types/user-type";
import { RestrictByUserAppAttrsServer } from "@/components/restrict-by-user-app-attrs-server";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { pId } = await searchParams;
  return (
    <RestrictByUserAppAttrsServer allowedUserTypes={ALLOWED_USER_TYPES}>
      <ManageNetworkEntities payerIdUrlParam={pId as string} />
    </RestrictByUserAppAttrsServer>
  );
}
