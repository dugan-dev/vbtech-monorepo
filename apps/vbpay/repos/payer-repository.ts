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

/**
 * Retrieves all payer records from the database.
 *
 * This function selects all entries from the "payer" table, returning detailed
 * information for each payer, including identifiers, performance dates, names,
 * and status flags.
 *
 * @returns A promise that resolves to an array of payer objects.
 */
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
