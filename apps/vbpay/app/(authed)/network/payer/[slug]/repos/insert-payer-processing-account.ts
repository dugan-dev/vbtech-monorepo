import "server-only";

import { db } from "@workspace/db/database";

/**
 * Inserts a record linking a payer with a processing account in the database.
 *
 * @param payerPubId - The public ID of the payer to link
 * @param processingAccountId - The ID of the processing account to link
 * @param userId - The ID of the user creating the link
 * @returns The result of the database insertion operation
 */
export function insertPayerProcessingAccount(
  payerPubId: string,
  processingAccountId: string,
  userId: string,
) {
  return db
    .insertInto("payerProcessingAccount")
    .values({
      payerPubId: payerPubId,
      pubId: processingAccountId,
      createdAt: new Date(),
      createdBy: userId,
    })
    .execute();
}
