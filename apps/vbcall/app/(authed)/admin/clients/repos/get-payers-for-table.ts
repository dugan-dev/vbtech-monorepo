import { db } from "@workspace/vbcall-db/database";

import "server-only";

export function getClientsForTable() {
  return db
    .selectFrom("client")
    .select([
      "pubId",
      "clientName",
      "clientCode",
      "timezone",
      "description",
      "isActive",
    ])
    .orderBy("clientName", "asc")
    .execute();
}
