import "server-only";

import { cache } from "react";

import { db } from "@workspace/db/database";

import { PayloadProcessingAccount } from "@/types/payload-api-response-types";
import { pl } from "@/lib/payload";

/**
 * Fetches all processing accounts from the payload service.
 * Ensures the response is JSON-serializable to prevent Next.js serialization issues.
 *
 * @returns A promise resolving to an array of processing account objects
 */
// Get all processing accounts from payload (not linked to a payer)
async function getAllProcessingAccounts() {
  const processingAccounts = await pl.select(pl.ProcessingAccount);
  // Use JSON.parse/stringify to ensure the data is serializable for Next.js
  // This prevents "Error: Objects are not valid as a React child" or similar serialization errors
  return JSON.parse(
    JSON.stringify(processingAccounts),
  ) as PayloadProcessingAccount[];
}

/**
 * Fetches processing account IDs associated with a specific payer from the database.
 *
 * @param payerPubId - The public ID of the payer
 * @returns A promise resolving to an array of processing account ID objects
 */
// Get all processing account ids for a given payer (from our database)
async function getProcessingAccountIdsByPayerPubId(payerPubId: string) {
  const payerProcessingAccountIds = await db
    .selectFrom("payerProcessingAccount")
    .select(["pubId"])
    .where("payerPubId", "=", payerPubId)
    .execute();

  return payerProcessingAccountIds;
}

/**
 * Retrieves processing accounts associated with a specific payer.
 * Combines data from the payload service and local database, and caches the result.
 *
 * @param payerPubId - The public ID of the payer
 * @returns A promise resolving to an array of processing accounts for the payer
 */
// Get all processing accounts for a given payer by filtering based on the processing account ids from our database
export const getPayersProcessingAccounts = cache(async (payerPubId: string) => {
  const [plProcessingAccounts, payerProcessingAccountIds] = await Promise.all([
    getAllProcessingAccounts(),
    getProcessingAccountIdsByPayerPubId(payerPubId),
  ]);

  const payersProcessingAccounts = plProcessingAccounts.filter(
    (processingAccount) => {
      return payerProcessingAccountIds.some((payerProcessingAccountId) => {
        return processingAccount.id === payerProcessingAccountId.pubId;
      });
    },
  );

  return payersProcessingAccounts;
});
