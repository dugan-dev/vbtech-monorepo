import { cache } from "react";

import { db } from "@workspace/db/database";

import "server-only";

/**
 * Retrieves all network entity records from the database.
 *
 * This function queries the "networkEntity" table selecting key fields:
 * pubId, netEntType, marketingName, legalName, referenceName, orgNpi, taxId, and isActive.
 * The records are sorted in ascending order by marketingName.
 *
 * @returns A promise that resolves to an array of network entity objects.
 */
export function getAllNetworkEntities() {
  return db
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
    .orderBy("marketingName", "asc")
    .execute();
}

export const getNetworkEntity = cache(async (pubId: string) => {
  return db
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
    .where("pubId", "=", pubId)
    .executeTakeFirst();
});
