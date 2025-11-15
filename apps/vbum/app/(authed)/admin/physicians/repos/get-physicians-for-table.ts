import { db } from "@workspace/vbum-db/database";

import "server-only";

/**
 * Retrieves a list of physicians from the database, selecting key fields and ordering them by physician first name.
 *
 * @returns A promise that resolves to an array of physician records, each containing `pubId`, `name`, `clientCodes`, `description`, and `isActive`.
 */
export async function getPhysiciansForTable() {
  return await db
    .selectFrom("physician")
    .select([
      "pubId",
      "name",
      "clients",
      "rateReview",
      "rateDenyWithdrawal",
      "rateP2p",
      "notes",
      "isActive",
    ])
    .orderBy("name", "asc")
    .execute();
}
