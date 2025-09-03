import { db } from "@workspace/db/database";

import "server-only";

/**
 * Fetches all health plan PBPs linked to a given client public ID.
 *
 * @param clientPubId - The public ID of the client whose health plan PBPs are being retrieved.
 * @returns A promise that resolves to an array of PBPs, each with `pubId`, `hpPubId`, `pbpId`, `pbpName`, and `isActive` fields.
 */
export async function getHealthPlanPbps(clientPubId: string) {
  return await db
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
