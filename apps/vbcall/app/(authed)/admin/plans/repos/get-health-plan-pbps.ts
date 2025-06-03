import { db } from "@workspace/vbcall-db/database";

import "server-only";

export function getHealthPlanPbps(clientPubId: string) {
  return db
    .selectFrom("healthPlanPbp as pbp")
    .innerJoin("healthPlan as hp", "hp.pubId", "pbp.hpPubId")
    .select([
      "pbp.pubId",
      "pbp.hpPubId",
      "pbp.pbpId",
      "pbp.pbpName",
      "pbp.isActive",
    ])
    .where("hp.clientPubId", "=", clientPubId)
    .execute();
}
