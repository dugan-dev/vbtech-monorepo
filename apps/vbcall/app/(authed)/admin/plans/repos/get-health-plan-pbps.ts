import { db } from "@workspace/vbcall-db/database";

import "server-only";

/**
 * Retrieves all health plan PBPs associated with the specified client public ID.
 *
 * @param clientPubId - The public identifier of the client whose health plan PBPs are to be fetched.
 * @returns A promise resolving to an array of PBPs, each containing `pubId`, `hpPubId`, `pbpId`, `pbpName`, and `isActive`.
 */
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
