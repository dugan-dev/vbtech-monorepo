import { db } from "@workspace/vbcall-db/database";

import "server-only";

/**
 * Retrieves health plans for a given client, selecting key plan details.
 *
 * @param clientPubId - The public identifier of the client whose health plans are to be fetched.
 * @returns A promise resolving to an array of health plan records, each containing `pubId`, `planName`, `planId`, `phoneNumber`, `faxNumber`, and `isActive`.
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
