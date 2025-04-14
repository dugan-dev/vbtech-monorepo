import { cache } from "react";

import { db } from "@workspace/db/database";

import "server-only";

export function getAllNetworkPhysicians() {
  return db
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
    .orderBy("lastName", "asc")
    .orderBy("firstName", "asc")
    .execute();
}

export const getNetworkPhysician = cache(async (pubId: string) => {
  return db
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
    .where("pubId", "=", pubId)
    .executeTakeFirst();
});
