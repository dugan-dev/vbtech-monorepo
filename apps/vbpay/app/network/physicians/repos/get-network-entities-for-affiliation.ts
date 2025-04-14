import { db } from "@workspace/db/database";

import { NetworkEntity } from "@/types/network-entity";

import "server-only";

/**
 * Retrieves all network entities affiliated with the specified payer.
 *
 * @param selectedPayer - The public ID of the payer whose network entities are to be fetched.
 * @returns A promise resolving to an array of network entities associated with the given payer, ordered by marketing name.
 */
export function getNetworkEntitiesForAffiliation({
  selectedPayer,
}: {
  selectedPayer: string;
}): Promise<NetworkEntity[]> {
  return db
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
