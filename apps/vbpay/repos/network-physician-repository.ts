import { cache } from "react";

import { db } from "@workspace/db/database";

import "server-only";

export const getAllNetworkPhysicians = cache(async () => {
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
    .orderBy("lastName", "asc")
    .orderBy("firstName", "asc")
    .execute();
});

export const getNetworkPhysician = cache(async (pubId: string) => {
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
    .where("pubId", "=", pubId)
    .executeTakeFirst();
});
