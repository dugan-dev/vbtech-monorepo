import { db } from "@workspace/vbum-db/database";

import "server-only";

/**
 * Retrieve health plans for a client identified by its public ID.
 *
 * @param clientPubId - The public identifier of the client whose health plans to fetch.
 * @returns An array of records containing `pubId`, `planName`, `clientName`, and `isActive` for each matching health plan.
 */
export async function getHealthPlansForTable(clientPubId: string) {
  return await db
    .selectFrom("healthPlan as hp")
    .innerJoin("client as c", "hp.clientPubId", "c.pubId")
    .select([
      "hp.pubId",
      "hp.planName",
      "c.clientName",
      "hp.clientPubId",
      "hp.tatStandard",
      "hp.tatExpedited",
      "hp.isActive",
    ])
    .where("hp.clientPubId", "=", clientPubId)
    .orderBy("hp.planName", "asc")
    .execute();
}
