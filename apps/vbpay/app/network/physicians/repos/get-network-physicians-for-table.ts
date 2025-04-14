import { db } from "@workspace/db/database";

import { NetworkPhysician } from "@/types/network-physician";

import "server-only";

/**
 * Retrieves a list of network physicians associated with the specified payer.
 *
 * @param selectedPayer - The public ID of the payer to filter physicians by.
 * @returns A promise resolving to an array of {@link NetworkPhysician} objects matching the payer, ordered by last and first name.
 */
export async function getNetworkPhysiciansForTable({
  selectedPayer,
}: {
  selectedPayer: string;
}): Promise<NetworkPhysician[]> {
  return await db
    .selectFrom("networkPhysician")
    .select([
      "pubId",
      "payerPubId",
      "taxId",
      "npi",
      "orgNpi",
      "firstName",
      "lastName",
      "type",
      "class",
      "soleProprietor",
      "primaryTaxonomyCode",
      "specialty",
      "credential",
      "isActive",
      "poNetEntPubId",
      "pracNetEntPubId",
      "faclNetEntPubId",
      "vendorNetEntPubId",
    ])
    .where("payerPubId", "=", selectedPayer)
    .orderBy("lastName", "asc")
    .orderBy("firstName", "asc")
    .execute();
}
