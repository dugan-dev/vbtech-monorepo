import { db } from "@workspace/db/database";

import { NetworkEntity } from "@/types/network-entity";

import "server-only";

export async function getNetworkEntitiesForAffiliation({
  selectedPayer,
}: {
  selectedPayer: string;
}): Promise<NetworkEntity[]> {
  return await db
    .selectFrom("networkEntity")
    .select([
      "pubId",
      "netEntType",
      "marketingName",
      "legalName",
      "referenceName",
      "orgNpi",
      "taxId",
      "isActive",
    ])
    // TODO: Add filter for selectedPayer
    // .where("payerPubId", "=", selectedPayer)
    .orderBy("marketingName", "asc")
    .execute();
}
