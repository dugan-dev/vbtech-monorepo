import { db } from "@workspace/db/database";

import { Payer } from "@/types/payer";

import "server-only";

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
