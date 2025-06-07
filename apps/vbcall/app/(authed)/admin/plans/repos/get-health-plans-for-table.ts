import { db } from "@workspace/vbcall-db/database";

import "server-only";

/**
 * Fetches health plan records associated with the specified client public ID.
 *
 * @param clientPubId - The public identifier of the client whose health plans are retrieved.
 * @returns A promise that resolves to an array of health plan objects, each including `pubId`, `planName`, `planId`, `phoneNumber`, `faxNumber`, and `isActive`.
 */
export async function getHealthPlansForTable(clientPubId: string) {
  return await db
    .selectFrom("healthPlan")
    .select([
      "healthPlan.pubId",
      "healthPlan.planName",
      "healthPlan.planId",
      "healthPlan.phoneNumber",
      "healthPlan.faxNumber",
      "healthPlan.isActive",
    ])
    .where("healthPlan.clientPubId", "=", clientPubId)
    .orderBy("healthPlan.planName", "asc")
    .execute();
}
