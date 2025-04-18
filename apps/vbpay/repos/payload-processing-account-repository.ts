import "server-only";

import { cache } from "react";

import { db } from "@workspace/db/database";

import { PayloadProcessingAccount } from "@/types/payload-api-response-types";
import { PayloadIntentType } from "@/types/payload-intent";
import { pl } from "@/lib/payload";

// Get the payload client id for a given intent
export async function getPayloadClientId(plIntent: PayloadIntentType) {
  const clientToken = await pl.ClientToken.create({
    intent: {
      type: plIntent,
    },
    attrs: "",
  });

  return clientToken.id as string;
}

// Get all processing accounts from payload (not linked to a payer)
async function getAllProcessingAccounts() {
  const processingAccounts = await pl.select(pl.ProcessingAccount);
  // Use JSON.parse/stringify to ensure the data is serializable for Next.js
  // This prevents "Error: Objects are not valid as a React child" or similar serialization errors
  return JSON.parse(
    JSON.stringify(processingAccounts),
  ) as PayloadProcessingAccount[];
}

// Get all processing account ids for a given payer (from our database)
async function getProcessingAccountIdsByPayerPubId(payerPubId: string) {
  const payerProcessingAccountIds = await db
    .selectFrom("payerProcessingAccount")
    .select(["pubId"])
    .where("payerPubId", "=", payerPubId)
    .execute();

  return payerProcessingAccountIds;
}

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
