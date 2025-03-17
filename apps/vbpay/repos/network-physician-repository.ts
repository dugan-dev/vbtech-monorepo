import { db } from "@workspace/db/database";

import "server-only";

export async function getAllNetworkPhysicians() {
  return await db
    .selectFrom("networkPhysician")
    .select([
      "pubId",
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
    .orderBy("lastName", "asc")
    .orderBy("firstName", "asc")
    .execute();
}
