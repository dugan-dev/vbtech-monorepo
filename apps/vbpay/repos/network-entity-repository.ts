import { db } from "@workspace/db/database";

import "server-only";

export async function getAllNetworkEntities() {
  return await db
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
