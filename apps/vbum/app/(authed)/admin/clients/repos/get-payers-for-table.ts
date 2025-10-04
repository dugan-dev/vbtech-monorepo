import { db } from "@workspace/vbum-db/database";

import "server-only";

/**
 * Retrieves a list of clients from the database, selecting key fields and ordering them by client name.
 *
 * @returns A promise that resolves to an array of client records, each containing `pubId`, `clientName`, `clientCode`, `timezone`, `description`, and `isActive`.
 */
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
