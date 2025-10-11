import { db } from "@workspace/vbum-db/database";

import "server-only";

/**
 * Fetches health plan records associated with the specified client public ID.
 *
 * @param clientPubId - The public identifier of the client whose health plans are retrieved.
 * @returns A promise that resolves to an array of health plan objects, each including `pubId`, `planName`, `planId`, `phoneNumber`, `faxNumber`, and `isActive`.
 */
export async function getHealthPlansForTable(clientPubId: string) {
  return await db
    .selectFrom("healthPlan as hp")
    .innerJoin("client as c", "hp.clientPubId", "c.pubId")
    .select(["hp.pubId", "hp.planName", "c.clientName", "hp.isActive"])
    .where("hp.clientPubId", "=", clientPubId)
    .orderBy("hp.planName", "asc")
    .execute();
}
