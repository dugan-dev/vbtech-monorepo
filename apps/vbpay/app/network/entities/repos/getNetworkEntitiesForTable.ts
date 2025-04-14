import { db } from "@workspace/db/database";

import { NetworkEntity } from "@/types/network-entity";

import "server-only";

/**
 * Retrieves network entities associated with a specific payer, ordered by marketing name.
 *
 * @param selectedPayer - The public identifier of the payer to filter network entities by.
 * @returns A promise resolving to an array of network entities matching the specified payer.
 */
export function getNetworkEntitiesForTable({
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
