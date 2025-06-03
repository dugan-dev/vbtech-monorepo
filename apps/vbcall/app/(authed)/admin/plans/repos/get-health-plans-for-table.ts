import { db } from "@workspace/vbcall-db/database";

import "server-only";

export function getHealthPlansForTable(clientPubId: string) {
  return db
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
