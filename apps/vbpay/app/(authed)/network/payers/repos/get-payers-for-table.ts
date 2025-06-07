import { db } from "@workspace/db/database";

import { Payer } from "@/types/payer";

import "server-only";

/**
 * Retrieves a list of payers matching the provided public IDs, ordered by marketing name.
 *
 * @param usersPayerPubIds - Array of payer public IDs to filter the results.
 * @returns A promise resolving to an array of {@link Payer} objects containing payer details.
 */
export async function getPayersForTable({
  usersPayerPubIds,
}: {
  usersPayerPubIds: string[];
}): Promise<Payer[]> {
  return await db
    .selectFrom("payer")
    .select([
      "pubId",
      "payerType",
      "initPerfYr",
      "initPerfMo",
      "cmsId",
      "marketingName",
      "legalName",
      "referenceName",
      "taxId",
      "parentOrgName",
      "websiteUrl",
      "isActive",
    ])
    .where("pubId", "in", usersPayerPubIds)
    .orderBy("marketingName", "asc")
    .execute();
}
