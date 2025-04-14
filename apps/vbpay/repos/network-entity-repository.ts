import { cache } from "react";

import { db } from "@workspace/db/database";

import "server-only";

export function getAllNetworkEntities() {
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
    .orderBy("marketingName", "asc")
    .execute();
}

export const getNetworkEntity = cache(async (pubId: string) => {
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
    .where("pubId", "=", pubId)
    .executeTakeFirst();
});
