import "server-only";

import { db } from "@workspace/db/database";

async function isPayerPubIdValid({ pubId }: { pubId: string }) {
  const payer = await db
    .selectFrom("payer")
    .where("pubId", "=", pubId)
    .select(["pubId"])
    .executeTakeFirst();

  return !!payer;
}

async function getPayerByPubId({ pubId }: { pubId: string }) {
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
    .where("pubId", "=", pubId)
    .select(["pubId"])
    .executeTakeFirst();
}

async function getAllPayers() {
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
    .execute();
}

export { isPayerPubIdValid, getPayerByPubId, getAllPayers };
