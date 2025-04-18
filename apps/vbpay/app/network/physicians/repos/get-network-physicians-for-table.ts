import { db } from "@workspace/db/database";

import { NetworkPhysician } from "@/types/network-physician";

import "server-only";

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
