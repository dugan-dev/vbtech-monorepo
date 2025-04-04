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

function getPayerByPubId({ pubId }: { pubId: string }) {
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
}

function getAllPayers() {
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

export { isPayerPubIdValid, getPayerByPubId, getAllPayers };
