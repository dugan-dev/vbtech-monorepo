import { db } from "@workspace/db/database";

import "server-only";

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
