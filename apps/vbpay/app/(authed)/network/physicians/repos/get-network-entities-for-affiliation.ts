import { db } from "@workspace/db/database";

import { NetworkEntity } from "@/types/network-entity";

import "server-only";

/**
 * Retrieves all network entities associated with a given payer.
 *
 * @param selectedPayer - The public identifier of the payer whose network entities are to be fetched.
 * @returns A promise resolving to an array of {@link NetworkEntity} objects matching the specified payer, ordered by marketing name.
 */
export async function getNetworkEntitiesForAffiliation({
  selectedPayer,
}: {
  selectedPayer: string;
}): Promise<NetworkEntity[]> {
  return await db
    .selectFrom("networkEntity")
    .select([
      "pubId",
      "payerPubId",
      "netEntType",
      "marketingName",
      "legalName",
      "referenceName",
      "orgNpi",
      "taxId",
      "isActive",
    ])
    .where("payerPubId", "=", selectedPayer)
    .orderBy("marketingName", "asc")
    .execute();
}
