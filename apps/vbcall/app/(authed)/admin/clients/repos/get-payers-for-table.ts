import { db } from "@workspace/vbcall-db/database";

import "server-only";

export async function getClientsForTable() {
  return await db
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
