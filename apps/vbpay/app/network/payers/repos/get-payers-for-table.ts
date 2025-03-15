import { db } from "@workspace/db/database";

import { Payer } from "@/types/payer";

import "server-only";

export async function getPayersForTable({
  usersPayerPubIds,
}: {
  usersPayerPubIds: string[];
}): Promise<Payer[]> {
  console.log("usersPayerPubIds", usersPayerPubIds);
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
    // TODO: Add filter for usersPayerPubIds
    // .where("pubId", "in", usersPayerPubIds)
    .orderBy("marketingName", "asc")
    .execute();
}
