import "server-only";

import { cache } from "react";

import { db } from "@workspace/db/database";

// Add cache for request deduplication
export const isPayerPubIdValid = cache(async ({ pubId }: { pubId: string }) => {
  const payer = await db
    .selectFrom("payer")
    .where("pubId", "=", pubId)
    .select(["pubId"])
    .executeTakeFirst();
  return !!payer;
});

// Add cache for request deduplication
export const getPayerByPubId = cache(async ({ pubId }: { pubId: string }) => {
  return db
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
    .where("pubId", "=", pubId)
    .executeTakeFirst();
});

export function getAllPayers() {
  return db
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
    .execute();
}
